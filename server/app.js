import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import cors from "cors"
import adminDashboardRouter from "./routes/admin/Admin-Dashboard/admin.dashboard.routes.js"
import adminAllUsersRouter from "./routes/admin/Admin-All-Users/admin.allUsers.routes.js"

const app = express();

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

app.use(helmet())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/auth", adminDashboardRouter);
app.use("/api/v2/auth", adminAllUsersRouter);

app.use(errorMiddleware);

export default app;