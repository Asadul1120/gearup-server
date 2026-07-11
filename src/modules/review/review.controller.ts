import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReviewServices } from "./review.service.js";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await ReviewServices.createReview(
    customerId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getGearReviews = catchAsync(async (req: Request, res: Response) => {
  const gearId = req.params.gearId as string;

  const result = await ReviewServices.getGearReviews(
    gearId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id as string;

  await ReviewServices.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewControllers = {
  createReview,
  getGearReviews,
  deleteReview,
};