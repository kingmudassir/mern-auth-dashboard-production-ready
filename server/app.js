import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser())

app.use("/api/v2/auth", authRoutes);

app.use(errorMiddleware);

export default app;