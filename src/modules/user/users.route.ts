import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import auth from "../../middleware/auth.js";
import { UserControllers } from "./users.controller.js";

const router = Router();

//Get all users Admin Only
router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUsers);

// Get single user Admin
router.get("/:id", auth(UserRole.ADMIN), UserControllers.getSingleUser);

// Logged In User update ( name, phone, profileImage, address )
router.patch(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  UserControllers.updateUser,
);

// Admin Only
router.put(
  "/status/:id",
  auth(UserRole.ADMIN),
  UserControllers.updateUserStatus,
);

// Admin Only
router.delete("/:id", auth(UserRole.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
