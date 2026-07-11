import { prisma } from "../../lib/prisma.js";
import config from "../../config/index.js";

import { ILoginUser, IRegisterUser } from "./auth.interface.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import { SignOptions } from "jsonwebtoken";


const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, phone, profileImage, address, role } = payload;
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  if (role && !["CUSTOMER", "PROVIDER"].includes(role)) {
    throw new Error(
      "You cannot register as ADMIN. only CUSTOMER or PROVIDER role is allowed",
    );
  }
  

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage,
      address,
      role: role || "CUSTOMER",
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const findeduser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findeduser) {
    throw new Error("please register first, Invalid email");
  }

  // Check password
  const isPasswordMatched = await comparePassword(
    password,
    findeduser.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: findeduser.id,
      email: findeduser.email,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const jwtPayload = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  };

  // Generate Access Token
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiration as SignOptions["expiresIn"],
  );

  return {
    accessToken,
    user,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthServices = {
  registerUser,
  loginUser,
  getMe,
};
