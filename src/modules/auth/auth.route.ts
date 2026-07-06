import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router();

router.post("/register", AuthControllers.registerUser);
router.post("/login", AuthControllers.loginUser);
router.get("/me", auth(UserRole.CUSTOMER, UserRole.PROVIDER,UserRole.ADMIN), AuthControllers.getMe);

export const AuthRoutes = router;