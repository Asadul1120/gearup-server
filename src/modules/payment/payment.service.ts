import Stripe from "stripe";
import httpStatus from "http-status";
import { Request } from "express";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../config/stripe.js";

const createPayment = async (customerId: string, rentalOrderId: string) => {
  // Check Rental
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      payment: true,
      gear: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental order not found");
  }

  // Check Owner
  if (rental.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay this rental",
    );
  }

  // Rental must be confirmed
  if (rental.status !== "CONFIRMED") {
    throw new AppError(httpStatus.BAD_REQUEST, "Rental is not confirmed yet");
  }

  // Already paid?
  if (rental.payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already exists");
  }

  // Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          unit_amount: Math.round(rental.totalAmount * 100),

          product_data: {
            name: rental.gear.name,
            description: rental.gear.description ?? "",
          },
        },
      },
    ],

    metadata: {
      rentalOrderId: rental.id,
      customerId,
    },

    success_url: "http://localhost:5173/payment-success",

    cancel_url: "http://localhost:5173/payment-cancel",
  });

  // Save payment
  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      transactionId: session.id,
      amount: rental.totalAmount,
      provider: "STRIPE",
      status: "PENDING",
    },
  });

  return {
    checkoutUrl: session.url,
    payment,
  };
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },

    include: {
      rentalOrder: {
        include: {
          gear: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSinglePayment = async (customerId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,

      rentalOrder: {
        customerId,
      },
    },

    include: {
      rentalOrder: {
        include: {
          gear: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const stripeWebhook = async (req: Request) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stripe signature is missing");
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripe_webhook_secret!,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await prisma.payment.findUnique({
        where: {
          transactionId: session.id,
        },
      });

      if (!payment) {
        return;
      }

      // Already Completed
      if (payment.status === "COMPLETED") {
        return;
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "COMPLETED",
            paidAt: new Date(),
          },
        });

        await tx.rentalOrder.update({
          where: {
            id: payment.rentalOrderId,
          },
          data: {
            status: "PAID",
          },
        });
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: {
          transactionId: session.id,
        },
        data: {
          status: "FAILED",
        },
      });

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

const deletePayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  const result = await prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });
  return result;
};

export const PaymentServices = {
  createPayment,
  stripeWebhook,
  getMyPayments,
  getSinglePayment,
  deletePayment
};
