// ─────────────────────────────────────────────────────────────────
// FILE: middlewares/optionalAuth.js
//
// Like isAuthenticated, but NEVER blocks the request.
// If a valid access token is present → populates req.user (with savedAds).
// If missing/expired/invalid → req.user stays undefined and we move on.
//
// Used on public routes (e.g. GET /cars) that need to return personalised
// data (isSaved) when a user happens to be logged in.
// ─────────────────────────────────────────────────────────────────
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const optionalAuth = async (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch the user AND their savedAds so getCars can compute isSaved
        const user = await User.findById(decoded.id)
            .select("savedAds role isBanned isDeleted")
            .lean();

        if (user && !user.isBanned && !user.isDeleted) {
            req.user = user;
        }
    } catch {
        // Expired / invalid token — just move on, don't block
    }

    next();
};