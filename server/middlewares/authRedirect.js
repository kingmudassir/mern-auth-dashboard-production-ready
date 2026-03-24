import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchAsyncError } from "./catchAsyncError.js";

export const redirectIfAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token, refreshToken } = req.cookies;

    // No access token at all — check if refresh token exists
    if (!token) {
        if (!refreshToken) return next(); // Truly not logged in
        return await attemptRefresh(req, res, next);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const existingUser = await User.findById(decoded.id);

        if (existingUser && !existingUser.isDeleted) {
            return res.status(200).json({ alreadyLoggedIn: true });
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

        console.log("Redirect: ", hashedToken)
        if (!existingUser || existingUser.isDeleted) return next();

        // ── Only rotate access token, keep existing refresh token ──
        const newAccessToken = existingUser.generateAccessToken();
        const newRefreshToken = existingUser.generateRefreshToken();

        await existingUser.save(); 

        res.cookie("token", newAccessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        sameSite: "strict",
        path: "/"
    });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            expires: new Date(existingUser.refreshTokenExpire),
            sameSite: "strict",
            path: "/"
        });

        return res.status(200).json({ alreadyLoggedIn: true });

    } catch (err) {
        next();
    }
}