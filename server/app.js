import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import cors from "cors"

const app = express();

app.use(helmet())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:5173",
        ].filter(Boolean),
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use("/api/v2/auth", authRoutes);

app.use(errorMiddleware);

export default app;