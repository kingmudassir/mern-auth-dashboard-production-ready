import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errors.js";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Not authenticated!", 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const existingUser = await User.findById(decoded.id).select("-password -refreshToken -refreshTokenExpire -resetPasswordToken -resetPasswordExpire -__v -updatedAt");

        if (!existingUser) {
            res
            .cookie("token", "", {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: "strict",
                path: "/"
            })
            .cookie("refreshToken", "", {
                expires: new Date(Date.now()),
                httpOnly: true,                
                sameSite: "strict",
                path: "/"
            })
            return next(new ErrorHandler("User no longer exists", 401));
        }

        req.user = existingUser;
        next();
    } catch (error) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        next(error);
    }
})