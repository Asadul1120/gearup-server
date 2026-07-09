import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { GearServices } from "./gear.service.js";
import httpStatus from "http-status";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user?.id;
  const result = await GearServices.createGear(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear created successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearServices.getAllGear(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully",
    data: result,
  });
});

const getSingleGear = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await GearServices.getSingleGear(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully",
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const gearId = req.params.id as string;
  const userId = req.user?.id;

  const result = await GearServices.updateGear(userId, gearId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const gearId = req.params.id as string;

  await GearServices.deleteGear(userId, gearId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear deleted successfully",
    data: null,
  });
});

export const GearControllers = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
};
