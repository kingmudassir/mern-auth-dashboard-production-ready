import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errors.js";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token, refreshToken } = req.cookies;

    if (!token) {
        if (!refreshToken) return next(new ErrorHandler("Not authenticated!", 401));
        return await attemptRefresh(req, res, next);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const existingUser = await User.findById(decoded.id).select("-password -refreshToken -refreshTokenExpire -resetPasswordToken -resetPasswordExpire -__v -updatedAt");

        if (!existingUser) {
            res
            .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true, sameSite: "strict", path: "/" })
            .cookie("refreshToken", "", { expires: new Date(Date.now()), httpOnly: true, sameSite: "strict", path: "/" });
            return next(new ErrorHandler("User no longer exists", 401));
        }

        req.user = existingUser;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError" && refreshToken) {
            return await attemptRefresh(req, res, next);
        }
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        next(error);
    }
});

async function attemptRefresh(req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return next(new ErrorHandler("Not authenticated!", 401));

    try {
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const existingUser = await User.findOne({
            refreshToken: hashedToken,
            refreshTokenExpire: { $gt: Date.now() }
        }).select("-password -refreshToken -resetPasswordToken -resetPasswordExpire -__v -updatedAt");

        console.log('hashedToken:', hashedToken);
        console.log('existingUser:', existingUser);

        if (!existingUser) return next(new ErrorHandler("Session expired. Please log in again.", 401));

        const remainingExpiry = existingUser.refreshTokenExpire;
        const newAccessToken = existingUser.generateAccessToken();
        const newRefreshToken = existingUser.generateRefreshToken(remainingExpiry - Date.now());

        console.log('refreshToken cookie:', refreshToken);
        console.log('remainingExpiry:', existingUser?.refreshTokenExpire);

        await existingUser.save({ validateModifiedOnly: true });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            sameSite: "strict",
            path: "/"
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            expires: new Date(remainingExpiry),
            sameSite: "strict",
            path: "/"
        });

        req.user = existingUser;
        next(); // ← continue to the protected route
    } catch (err) {
        next(new ErrorHandler("Session expired. Please log in again.", 401));
    }
}