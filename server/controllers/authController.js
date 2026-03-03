import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errors.js";
import { User } from "../models/userSchema.js";
import crypto from "crypto";
import { sendEmail } from "../utilities/sendEmail.js";

// =========================
// Password strength validator
// Enforced here, not in schema (schema only sees the hash)
// =========================
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,128}$/;

const validatePasswordStrength = (password) => {
    if (!password || typeof password !== "string") return false;
    return PASSWORD_REGEX.test(password);
};

// =========================
// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
// =========================
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    // ---- Basic field presence check ----
    if (!name || !email || !password) {
        return next(new ErrorHandler("Name, email, and password are required.", 400));
    }

    // ---- Type safety ----
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return next(new ErrorHandler("Invalid input types.", 400));
    }

    // ---- Sanitize ----
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    // ---- Name length ----
    if (sanitizedName.length < 3 || sanitizedName.length > 50) {
        return next(new ErrorHandler("Name must be between 3 and 50 characters.", 400));
    }

    // ---- Email format ----
    const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
        return next(new ErrorHandler("Please provide a valid email address.", 400));
    }

    // ---- Password strength ----
    if (!validatePasswordStrength(password)) {
        return next(
            new ErrorHandler(
                "Password must be 8-128 characters and include uppercase, lowercase, a number, and a special character (@$!%*?&).",
                400
            )
        );
    }

    // ---- Check for existing verified user ----
    const existingUser = await User.findOne({ email: sanitizedEmail });

    if (existingUser) {
        if (existingUser.isEmailVerified) {
            // Don't reveal whether an email is registered — return the same
            // response as success to prevent user enumeration attacks.
            // Log internally if needed.
            return res.status(200).json({
                success: true,
                message: "If this email is not registered, a verification code has been sent."
            });
        }

        // User registered but never verified — resend code if previous one expired,
        // otherwise tell them to check their email.
        if (
            existingUser.emailVerificationCodeExpire &&
            existingUser.emailVerificationCodeExpire > Date.now()
        ) {
            return res.status(200).json({
                success: true,
                message: "A verification code was already sent. Please check your email."
            });
        }

        // Previous code expired — generate a fresh one and update the record
        const verificationCode = existingUser.generateVerificationCode();
        await existingUser.save({ validateModifiedOnly: true });

        // TODO: Send verificationCode via your email service here
        // await sendEmail({ to: sanitizedEmail, code: verificationCode });

        return res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email."
        });
    }

    // ---- Create user ----
    const user = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        password // pre-save hook will hash this
    });

    // ---- Generate and save verification code ----
    const verificationCode = user.generateVerificationCode();
    await user.save({ validateModifiedOnly: true });

    // TODO: Send verificationCode via your email service here
    // await sendEmail({ to: sanitizedEmail, code: verificationCode });
    await sendVerificationCode(verificationCode, user.email);

    return res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email for your verification code."
    });
});


// =========================
// @desc    Verify email with OTP code
// @route   POST /api/v1/auth/verify-email
// @access  Public
// =========================
export const verifyEmail = catchAsyncError(async (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return next(new ErrorHandler("Email and verification code are required.", 400));
    }

    // Hash the incoming code to compare against the stored hash
    const hashedCode = crypto
        .createHash("sha256")
        .update(code.toString().trim())
        .digest("hex");

    const user = await User.findOne({
        email: email.trim().toLowerCase(),
        emailVerificationCode: hashedCode,
        emailVerificationCodeExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid or expired verification code.", 400));
    }

    // ---- Mark verified and clear code fields ----
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpire = undefined;

    // ---- Generate tokens ----
    const accessToken = user.generateAccessToken();
    const rawRefreshToken = user.generateRefreshToken();

    await user.save({ validateModifiedOnly: true });

    // ---- Set cookies ----
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", rawRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

async function sendVerificationCode(verificationCode, email) {
    try {
        const message = generateEmailTemplate(verificationCode);

        await sendEmail({ email, subject: "Your verification code: ", message });
    } catch (error) {
        throw new ErrorHandler("Failed to send verification email", 500);
    }
}





function generateEmailTemplate(verificationCode) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 16px; color: #333;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
            ${verificationCode}
            </span>
        </div>
        <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
        <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
            <p>Thank you,<br>Your Company Team</p>
            <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
        </footer>
        </div>
        `
}