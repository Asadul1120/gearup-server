import Stripe from "stripe";
import httpStatus from "http-status";
import { Request } from "express";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../config/stripe.js";

const createPayment = async (
  customerId: string,
  rentalOrderId: string,
) => {
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rental order not found",
    );
  }

  if (rental.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay this rental",
    );
  }

  if (rental.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental is not confirmed yet",
    );
  }

  if (rental.payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment already completed",
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "BDT",

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

    success_url: `${config.app_url}/payment-success`,

    cancel_url: `${config.app_url}/payment-cancel`,
  });

  return {
    checkoutUrl: session.url,
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

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripe_webhook_secret!,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const rentalOrderId = session.metadata?.rentalOrderId;

      if (!rentalOrderId) return;

      const existingPayment = await prisma.payment.findFirst({
        where: {
          transactionId: session.id,
        },
      });

      if (existingPayment) return;

      await prisma.$transaction(async (tx) => {
        await tx.payment.create({
          data: {
            rentalOrderId,
            transactionId: session.id,
            amount: Number(session.amount_total!) / 100,
            provider: "STRIPE",
            status: "COMPLETED",
            paidAt: new Date(),
          },
        });

        await tx.rentalOrder.update({
          where: {
            id: rentalOrderId,
          },
          data: {
            status: "PAID",
          },
        });
      });

      break;
    }

    default:
      break;
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
