import {rateLimit} from "express-rate-limit"
import ErrorHandler from "./errors.js";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many login attempts. Try again later.", 429));
    },
});

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    handler: (req, res) => {
        res.status(429).json({
        success: false,
        message: "Too many signup attempts from this IP.",
        });
    },
});

export const otpLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    limit: 3,                  
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many OTP requests. Please try again later.", 429));
    },
});