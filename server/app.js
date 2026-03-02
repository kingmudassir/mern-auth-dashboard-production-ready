import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/errors.js";

const app = express();

app.use(express.json());

app.use("/api/v2/auth", authRoutes);

app.use(errorMiddleware);

export default app;