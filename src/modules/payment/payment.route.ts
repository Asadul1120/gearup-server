import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";

import auth from "../../middleware/auth.js";
import { PaymentControllers } from "./payment.controller.js";

const router = Router();

// Stripe Webhook 
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentControllers.webhook,
);

// Customer
router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  PaymentControllers.createPayment,
);

router.get(
  "/",
  auth(UserRole.CUSTOMER),
  PaymentControllers.getMyPayments,
);

router.get(
  "/:id",
  auth(UserRole.CUSTOMER),
  PaymentControllers.getSinglePayment,
);


//develoment use only
router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  PaymentControllers.deletePayment,
);

export const PaymentRoutes = router;