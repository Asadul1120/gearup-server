import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { UserRole, UserStatus } from "../../generated/prisma/enums.js";
import { verifyToken } from "../utils/jwt.js";
import httpStatus from "http-status";


const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get Token
      const token = req.cookies?.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized. Please login first."
        );
      }

      // Verify Token
      const verifiedToken = await verifyToken(
        token,
        config.jwt_access_secret!
      ) as JwtPayload;

      if (!verifiedToken.success) {
        throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
      }

      const { id, role } = verifiedToken.data as JwtPayload;

      // Check User
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
      }

      // Check User Status
      if (user.status === UserStatus.SUSPENDED) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Your account has been suspended."
        );
      }

      // Check Role
      if (
        requiredRoles.length &&
        !requiredRoles.includes(role)
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized to access this resource."
        );
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };

      next();
    }
  );
};

export default auth;