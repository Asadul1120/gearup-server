import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateGear, IUpdateGear } from "./gear.interface.js";
import httpStatus from "http-status";

const createGear = async (providerId: string, payload: ICreateGear) => {
  // Check Category
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await prisma.gear.create({
    data: {
      ...payload,
      providerId,
    },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
    },
  });

  return result;
};

const getAllGear = async (query: any) => {
  const {
    search,
    brand,
    categoryId,
    availability,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (brand) {
    where.brand = brand;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (availability !== undefined) {
    where.availability = availability === "true";
  }

  if (minPrice || maxPrice) {
    where.pricePerDay = {};

    if (minPrice) {
      where.pricePerDay.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.pricePerDay.lte = Number(maxPrice);
    }
  }

  const data = await prisma.gear.findMany({
    where,
    skip,
    take: Number(limit),

    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.gear.count({
    where,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data,
  };
};


const getSingleGear = async (id: string) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  return gear;
};

const updateGear = async (
  providerId: string,
  gearId: string,
  payload: IUpdateGear
) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this gear"
    );
  }

  const updatedGear = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: payload,
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedGear;
};


const deleteGear = async (
  providerId: string,
  gearId: string
) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this gear"
    );
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};


export const GearServices = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
};