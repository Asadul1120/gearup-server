import express, { Application, Request, Response } from "express";
import cors from "cors";
import notFound from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { AuthRoutes } from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./modules/user/users.route.js";
import { CategoryRoutes } from "./modules/category/category.route.js";
import { GearRoutes } from "./modules/gear/gear.route.js";
import { RentalRoutes } from "./modules/rental/rental.route.js";
import { PaymentRoutes } from "./modules/payment/payment.route.js";

const app: Application = express();

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cors
app.use(cors());

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to GearUp Server API 🚀",
  });
});

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/gear", GearRoutes);
app.use("/api/rentals", RentalRoutes);
app.use("/api/payments", PaymentRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
