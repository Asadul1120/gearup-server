import { UserRole } from "../../../generated/prisma/client.js";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { IUpdateUser, IUpdateUserStatus } from "./users.interface.js";
import httpStatus from "http-status";

// Get all users
const getAllUsers = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get single user by ID
const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Update user by ID
const updateUser = async (id: string, payload: IUpdateUser) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      phone: payload.phone,
      profileImage: payload.profileImage,
      address: payload.address,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

// Update user status  admin only
const updateUserStatus = async (id: string, payload: IUpdateUserStatus) => {
  if (!payload?.status) {
    throw new AppError(httpStatus.BAD_REQUEST, "Status is required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Delete user by ID
const deleteUser = async (id: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (id === userId && user?.role === UserRole.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot delete your own account.",
    );
  }

  return await prisma.user.delete({
    where: { id },
  });
};

export const UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};
