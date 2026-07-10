import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateRental } from "./rental.interface.js";
import { RentalStatus } from "../../../generated/prisma/enums.js";
const createRental = async (
  customerId: string,
  payload: ICreateRental
) => {
  const gear = await prisma.gear.findUnique({
    where: {
      id: payload.gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  if (!gear.availability) {
    throw new AppError(httpStatus.BAD_REQUEST, "Gear is not available");
  }

  if (gear.stock < payload.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (startDate >= endDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date"
    );
  }

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
 

  const totalAmount =
    totalDays * gear.pricePerDay * payload.quantity;

  const rental = await prisma.rentalOrder.create({
    data: {
      customerId,
      gearId: payload.gearId,
      quantity: payload.quantity,
      startDate,
      endDate,
      totalAmount,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gear: true,
    },
  });

  return rental;
};

const getMyRentals = async (customerId: string) => {
  const rentals = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gear: {
        include: {
          category: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};

const getSingleRental = async (
  rentalId: string,
  customerId: string
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      gear: {
        include: {
          category: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  }

  return rental;
};

const getProviderOrders = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      gear: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};



const updateRentalStatus = async (
  providerId: string,
  rentalId: string,
  status: RentalStatus
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      gear: {
        providerId,
      },
    },
    include: {
      gear: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
  }

  const updatedRental = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
    include: {
      customer: true,
      gear: true,
      payment: true,
    },
  });

  return updatedRental;
};

export const RentalServices = {
  createRental,
  getMyRentals,
  getSingleRental,
  getProviderOrders,
  updateRentalStatus,
};