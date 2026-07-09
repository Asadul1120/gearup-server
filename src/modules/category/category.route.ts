import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";

import auth from "../../middleware/auth.js";
import { CategoryControllers } from "./category.controller.js";

const router = Router();

// Public Routes
router.get("/", CategoryControllers.getAllCategories);
router.get("/:id", CategoryControllers.getSingleCategory);

// Private Routes
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  CategoryControllers.createCategory,
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  CategoryControllers.updateCategory,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
