import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchAsyncError } from "./catchAsyncError.js";

export const redirectIfAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token, refreshToken } = req.cookies;

    // No access token at all — check if refresh token exists
    if (!token) {
        if (!refreshToken) return next(); // Truly not logged in
        // return await attemptRefresh(req, res, next);
        return await attemptRefresh(req, res, next);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const existingUser = await User.findById(decoded.id);

        if (existingUser) {
            return res.status(200).json({ alreadyLoggedIn: true, redirectTo: "/userprofile" });
        }

        next();
    } catch (error) {
        // Access token expired or invalid — try refresh
        if (error.name === "TokenExpiredError" && refreshToken) {
            return await attemptRefresh(req, res, next);
        }
        next();
    }
});

async function attemptRefresh(req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return next();

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const existingUser = await User.findOne({
            refreshToken: hashedToken,
            refreshTokenExpire: { $gt: Date.now() }
        });

        if (!existingUser) return next(); // Invalid refresh token — let them log in

        const newAccessToken = existingUser.generateAccessToken();
        const newRefreshToken = existingUser.generateRefreshToken();
        await existingUser.save({ validateModifiedOnly: true });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            sameSite: "strict",
            path: "/"
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "strict",
            path: "/"
        });

        // Refresh succeeded — tell frontend he's already authenticated
        return res.status(200).json({ alreadyLoggedIn: true, redirectTo: "/userprofile" });

    } catch (err) {
        next(); // Refresh failed — let them log in normally
    }
}