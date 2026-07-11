import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";

import auth from "../../middleware/auth.js";
import { ReviewControllers } from "./review.controller.js";

const router = Router();

// Customer
router.post("/", auth(UserRole.CUSTOMER), ReviewControllers.createReview);

export const ReviewRoutes = router;
