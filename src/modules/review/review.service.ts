import httpStatus from "http-status";

import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateReview } from "./review.interface.js";

const createReview = async (customerId: string, payload: ICreateReview) => {
  // Check Gear
  const gear = await prisma.gear.findUnique({
    where: {
      id: payload.gearId,
    },
  });

  if (!gear) {
    throw new AppError(httpStatus.NOT_FOUND, "Gear not found");
  }

  // Customer must have returned this gear
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearId: payload.gearId,
      status: "RETURNED",
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only returned rentals",
    );
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      gearId: payload.gearId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this gear",
    );
  }

  // Rating validation
  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearId: payload.gearId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      gear: {
        select: {
          id: true,
          name: true,
          brand: true,
        },
      },
    },
  });

  return review;
};

export const ReviewServices = {
  createReview,
};
