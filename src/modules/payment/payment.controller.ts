import { Request, Response } from "express";
import httpStatus from "http-status";

import { PaymentServices } from "./payment.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { rentalOrderId } = req.body;

  const result = await PaymentServices.createPayment(customerId, rentalOrderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

const webhook = async (req: Request, res: Response) => {
  try {
    await PaymentServices.stripeWebhook(req);

    return res.status(200).json({
      received: true,
    });
  } catch (error: any) {
    console.error("Stripe Webhook Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;

  const result = await PaymentServices.getMyPayments(customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const paymentId = req.params.id as string;

  const result = await PaymentServices.getSinglePayment(customerId, paymentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.id as string;

  await PaymentServices.deletePayment(paymentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully",
    data: null,
  });
});

export const PaymentControllers = {
  createPayment,
  webhook,
  getMyPayments,
  getSinglePayment,
  deletePayment,
};
