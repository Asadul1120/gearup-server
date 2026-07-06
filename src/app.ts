import express, { Application, Request, Response } from "express";
import cors from "cors";
import notFound from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { AuthRoutes } from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";

const app: Application = express();

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









app.use(globalErrorHandler);
app.use(notFound);

export default app;