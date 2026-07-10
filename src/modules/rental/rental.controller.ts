import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { RentalServices } from "./rental.service.js";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await RentalServices.createRental(customerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental created successfully",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await RentalServices.getMyRentals(customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const rentalId = req.params.id as string;

  const result = await RentalServices.getSingleRental(rentalId, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental retrieved successfully",
    data: result,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id;

  const result = await RentalServices.getProviderOrders(providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id;
  const rentalId = req.params.id as string;

  const result = await RentalServices.updateRentalStatus(
    providerId,
    rentalId,
    req.body.status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental status updated successfully",
    data: result,
  });
});

export const RentalControllers = {
  createRental,
  getMyRentals,
  getSingleRental,
  getProviderOrders,
  updateRentalStatus,
};
