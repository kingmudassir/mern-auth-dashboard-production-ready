import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";


export const redirectIfAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const existingUser = await User.findById(decoded.id);

        if (existingUser) {
            return res.status(200).json({ alreadyLoggedIn: true, redirectTo: "/dashboard" });
        }

        next(); 
    } catch (error) {
        next(); 
    }
});