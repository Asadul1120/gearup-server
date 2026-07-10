import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";

import auth from "../../middleware/auth.js";
import { RentalControllers } from "./rental.controller.js";

const router = Router();

// Customer
router.post("/", auth(UserRole.CUSTOMER), RentalControllers.createRental);

router.get("/", auth(UserRole.CUSTOMER), RentalControllers.getMyRentals);

router.get("/:id", auth(UserRole.CUSTOMER), RentalControllers.getSingleRental);

// Provider
router.get(
  "/provider/orders",
  auth(UserRole.PROVIDER),
  RentalControllers.getProviderOrders
);

router.patch(
  "/provider/orders/:id",
  auth(UserRole.PROVIDER),
  RentalControllers.updateRentalStatus
);

export const RentalRoutes = router;
