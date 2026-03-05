import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errors.js";
import validator from "validator"
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utilities/sendEmail.js";
import crypto from "crypto";
import { sendToken } from "../utilities/sendToken.js";

const validateEmail = (rawEmail) => {
    if (!rawEmail || typeof rawEmail !== "string") {
        return "Email is required."
    }

    // Normalize first (lowercase, remove dots where applicable, etc.)
    const email = validator.normalizeEmail(rawEmail, {
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
        outlookdotcom_remove_subaddress: false,
        yahoo_remove_subaddress: false,
        icloud_remove_subaddress: false,
    });

    if (!email) {
        return "Invalid email."
    }

    // Hard limits from RFC
    if (email.length > 254) {
        return "Email too long."
    }

    const [local, domain] = email.split("@");

    if (!local || !domain) {
        return "Invalid email structure."
    }

    if (local.length > 64) {
        return "Invalid email."
    }

    // Format + domain rules
    const isValid = validator.isEmail(email, {
        require_tld: true,
        allow_utf8_local_part: false,
        allow_ip_domain: false,
        domain_specific_validation: true,
        blacklisted_chars: "()<>,;:\\\"[]",
    });

    if (!isValid) {
        return "Invalid email."
    }

    // Disposable domain blocking (basic but effective)
    const disposableDomains = [
        "tempmail.com",
        "10minutemail.com",
        "mailinator.com",
        "guerrillamail.com",
        "yopmail.com",
    ];

    if (disposableDomains.includes(domain)) {
        return "Disposable emails are not allowed."
    }

    return null
};

const validate = (name, email, password) => {
    if (!name || !email || !password) {
        return "All fields are required."
    }

    if (name.length < 3 || name.length > 50 || !/^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]{2,})*$/.test(name) ) {
        return "Invalid name."
    }

    const emailResult = validateEmail(email);
    if (typeof emailResult === "string") {
        return emailResult;
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
    }

    return null
}

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validate input
    const validationError = validate(name, email, password);
    if (validationError) {
        return next(new ErrorHandler(validationError, 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isEmailVerified) {
            return res.status(409).json({
                success: false,
                message: "Account already registered!"
            });
        }

        // User exists but email not verified → resend verification code
        const verificationCode = existingUser.generateVerificationCode();
        await existingUser.save({ validateModifiedOnly: true });

        try {
            await sendVerificationCode(verificationCode, existingUser.email);
            return res.status(200).json({
                success: true,
                message: "Verification code resent!",
            });
        } catch (error) {
            // Reset verification code on failure
            existingUser.emailVerificationCode = null;
            await existingUser.save({ validateModifiedOnly: true });
            return next(
                new ErrorHandler(
                    `${error.message} - Verification code sending failed. Try registering again.`,
                    500
                )
            );
        }
    }

    // User does not exist → create new user
    const newUser = await User.create({ name, email, password });
    const verificationCode = newUser.generateVerificationCode();
    await newUser.save({ validateModifiedOnly: true });

    try {
        await sendVerificationCode(verificationCode, newUser.email);
        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
        });
    } catch (error) {
        // If sending fails, cleanup verification code
        newUser.emailVerificationCode = null;
        newUser.emailVerificationCodeExpire = null
        await newUser.save({ validateModifiedOnly: true });
        return next(
            new ErrorHandler(
                `${error.message} - Verification code sending failed. Try registering again.`,
                500
            )
        );
    }
});

export const resendOTP = catchAsyncError(async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return next(new ErrorHandler("Resend unsuccessful. Try registering again.", 403))
    }

    const existingUser = await User.findOne({
        email,
        isEmailVerified: false,
    });

    if (!existingUser) {
        return next(new ErrorHandler("Resend unsuccessful. Try registering again.", 403))
    }

    const verificationCode = existingUser.generateVerificationCode();
    await existingUser.save({ validateModifiedOnly: true });

        try {
        await sendVerificationCode(verificationCode, existingUser.email);
        return res.status(200).json({
            success: true,
            message: "Verification code resent!",
        });
    } catch (error) {
        // If sending fails, cleanup verification code
        existingUser.emailVerificationCode = null;
        existingUser.emailVerificationCodeExpire = null
        await existingUser.save({ validateModifiedOnly: true });
        return next(
            new ErrorHandler(
                `${error.message} - Verification code sending failed. Try registering again.`,
                500
            )
        );
    };
})

export const verifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return next(new ErrorHandler("There seems to be an error. Try registering again.", 400));
    }

    const convertedVerificationCode = crypto
        .createHash("sha256")
        .update(String(verificationCode))
        .digest("hex");

    const existingUser = await User.findOne({
        email,
        emailVerificationCode: convertedVerificationCode,
        emailVerificationCodeExpire: { $gt: Date.now() }
    });

    if (!existingUser) {
        return next(new ErrorHandler("Invalid or expired OTP.", 400));
    }

    existingUser.isEmailVerified = true;
    existingUser.emailVerificationCode = null;
    existingUser.emailVerificationCodeExpire = null;

    await existingUser.save({ validateModifiedOnly: true });

    sendToken(existingUser, 200, "Account Verified.", res);
});

export const refreshAccessToken = async (req, res, next) => {

    const { refreshToken } = req.cookies;

    if (!refreshToken)
        return next(new ErrorHandler("Unauthorized", 401));

    const hashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const existingUser = await User.findOne({ 
        refreshToken: hashedToken,
        refreshTokenExpire: { $gt: Date.now() } 
    });

    if (!existingUser)
        return next(new ErrorHandler("Invalid refresh token", 401));

    const newAccessToken = existingUser.generateAccessToken();
    await existingUser.save({ validateModifiedOnly: true });


    res.cookie("token", newAccessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.json({
        success: true,
    });
};

async function sendVerificationCode(verificationCode, email) {
    try {
        const message = generateEmailTemplate(verificationCode);

        await sendEmail({ email, subject: "Your verification code: ", message });
    } catch (error) {
        throw new ErrorHandler(`Failed to send verification email: ${error.message}`, 500);
    }
}

export const resetPassword = catchAsyncError(req, res, next) {
    
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