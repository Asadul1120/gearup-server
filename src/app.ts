import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to GearUp Server API 🚀",
  });
});

export default app;