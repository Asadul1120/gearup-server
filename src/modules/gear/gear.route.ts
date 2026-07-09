import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";

import auth from "../../middleware/auth.js";
import { GearControllers } from "./gear.controller.js";

const router = Router();

// Get all gear
router.get("/", GearControllers.getAllGear);

// Get single gear
router.get("/:id", GearControllers.getSingleGear);

// Create gear
router.post("/", auth(UserRole.PROVIDER), GearControllers.createGear);

// Update gear
router.put("/:id", auth(UserRole.PROVIDER), GearControllers.updateGear);

// admin and provider can delete gear
router.delete(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  GearControllers.deleteGear,
);

export const GearRoutes = router;
