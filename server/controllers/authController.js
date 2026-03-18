import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errors.js";
import validator from "validator"
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utilities/sendEmail.js";
import crypto from "crypto";
import { sendToken } from "../utilities/sendToken.js";
import { validatePhone } from "../utilities/PhoneValidator.js";

export const validateEmail = (rawEmail) => {
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

const validate = (name, email, password, phone) => {
    if (!name || !email || !password || !phone) {
        return "All fields are required."
    }

    if (name.length < 2 || name.length > 50 || !/^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]{2,})*$/.test(name) ) {
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

    const phoneError = validatePhone(phone);
    if (phoneError) return phoneError;

    return null
}

export const register = catchAsyncError(async (req, res, next) => {
    console.log("Controller Hit!")
    const { name, email, password, phone } = req.body;

    // Validate input
    const validationError = validate(name, email, password, phone);
    if (validationError) {
        return next(new ErrorHandler(validationError, 400));
    }

    // Check if phone is already taken by a verified account
    const existingPhone = await User.findOne({ phone, isAccountVerified: true });
    if (existingPhone) {
        return res.status(409).json({
            success: false,
            message: "An account with this phone number already exists."
        });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isAccountVerified) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // User exists but email not verified → update phone in case it changed, resend code
        existingUser.phone = phone;
        const verificationCode = existingUser.generateVerificationCode();
        await existingUser.save({ validateModifiedOnly: true });

        try {
            await sendVerificationCode(verificationCode, existingUser.email);
            return res.status(200).json({
                success: true,
                message: "Verification code resent!",
            });
        } catch (error) {
            existingUser.emailVerificationCode = undefined;
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
    const newUser = await User.create({ name, email, password, phone });
    const verificationCode = newUser.generateVerificationCode();
    await newUser.save({ validateModifiedOnly: true });

    try {
        await sendVerificationCode(verificationCode, newUser.email);
        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
        });
    } catch (error) {
        newUser.emailVerificationCode = undefined;
        newUser.emailVerificationCodeExpire = undefined;
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
        isAccountVerified: false,
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
        existingUser.emailVerificationCode = undefined;
        existingUser.emailVerificationCodeExpire = undefined
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

    existingUser.isAccountVerified = true;
    existingUser.isEmailVerified = true;
    existingUser.emailVerificationCode = undefined;
    existingUser.emailVerificationCodeExpire = undefined;

    await existingUser.save({ validateModifiedOnly: true });

    sendToken(existingUser, 200, "Account Verified.", res);
});

export const refreshAccessToken = catchAsyncError(async (req, res, next) => {

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
    
    const remainingExpiry = existingUser.refreshTokenExpire;

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
        expires: new Date(remainingExpiry),
        sameSite: "strict",
        path: "/"
    });

    res.status(200).json({
        success: true,
        newAccessToken,
        newRefreshToken
    });
});

export async function sendVerificationCode(verificationCode, email) {
    try {
        const message = generateEmailTemplate(verificationCode);

        await sendEmail({ email, subject: "Your verification code: ", message });
    } catch (error) {
        throw new ErrorHandler(`Failed to send verification email: ${error.message}`, 500);
    }
}

export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { password, confirmPassword } = req.body;

    if (!req.params.token)
        return next(new ErrorHandler("Invalid reset request", 400));

    if (!password || !confirmPassword)
        return next(new ErrorHandler("Password fields are required", 400));

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return next(new ErrorHandler(
            "Password must be 8+ chars with uppercase, lowercase, number, and symbol.",
            400
        ));
    }

    if (password !== confirmPassword)
        return next(new ErrorHandler("Passwords do not match", 400));

    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const existingUser = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!existingUser)
        return next(new ErrorHandler("Reset token is invalid or expired", 400));

    existingUser.password = password;

    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpire = undefined;

    await existingUser.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Password reset successful"
    });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body

    const emailError = validateEmail(email);

    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    const existingUser = await User.findOne({
        email,
        isAccountVerified: true,
        isEmailVerified: true
    })

    if (!existingUser) {
        return next(new ErrorHandler("User does not exist.", 404))
    }

    const generateResetPasswordToken = existingUser.generateResetPasswordToken()
    await existingUser.save({ validateModifiedOnly: false })

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${generateResetPasswordToken}`;
    const message = generateResetPasswordEmailTemplate(resetPasswordUrl);


    try {
        await sendEmail({
            email: existingUser.email,
            subject: "Password Reset Request",
            message,
        });

        return res.status(200).json({
            success: true,
            message: "A password reset link has been sent to your email!",
        });
    } catch (error) {

        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordExpire = undefined;
        await existingUser.save({ validateBeforeSave: false });

        throw new ErrorHandler(`Failed to send verification email: ${error.message}`, 500);
    }
})

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All password fields are required.", 400));
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return next(new ErrorHandler("Current password is incorrect.", 401));
    }

    // Check new password matches confirmation
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("New passwords do not match.", 400));
    }

    // Strong password validation
    if (!validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return next(new ErrorHandler(
            "New password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
            400
        ));
    }

    // Update password
    user.password = newPassword;

    // Save only the modified field (hash will run via pre-save hook)
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Password changed successfully."
    });
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, rememberMe } = req.body

    const emailError = validateEmail(email);

    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    const existingUser = await User.findOne({
        email,
        isAccountVerified: true
    }).select("+password")

    // first check if user exists
    if (!existingUser) {
        return next(new ErrorHandler("Email does not exist.", 401));
    }

    // check if user scheduled his account for deletion
    if (existingUser.deleteAccountRequestAt) {
        existingUser.deleteAccountRequestAt = undefined
        existingUser.deletionPausedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await existingUser.save({ validateModifiedOnly: true })
    }

    // compare password
    const doesPassMatch = await existingUser.comparePassword(password);

    if (!doesPassMatch) {
        return next(new ErrorHandler("Incorrect email or password.", 401));
    }

    sendToken(existingUser, 200, "User logged in successfully.", res, rememberMe);
})

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200)
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
    .json({
        success: true,
        message: "Logged out successfully.",
    })
})

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user
    res.status(200).json({
        success: true,
        user
    })
})

export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({ role: "user" }).select("-password -refreshToken -refreshTokenExpire -resetPasswordToken -resetPasswordExpire -__v -updatedAt");

    res.status(200).json({
        success: true,
        message: "Request successful",
        count: users.length,
        users
    });
});

export const deleteAccount = catchAsyncError(async (req, res, next) => {
    const { currentPassword } = req.body

    const now = new Date()

    const existingUser = await User.findById(req.user._id).select("+password")

    const isMatch = await existingUser.comparePassword(currentPassword)

    if (!isMatch) {
        return next(new ErrorHandler("Incorrect password.", 401))
    }

    const remainingMs = existingUser.deletionPausedUntil - now;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    if (now <= existingUser.deletionPausedUntil) {
        return res.status(403).json({
            success: false,
            message: `Account can be deleted after a period of ${remainingDays} days.`
        })
    }

    existingUser.deleteAccountRequestAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await existingUser.save({ validateModifiedOnly: true })

    res.status(200).json({
        success: true, 
        message: "Account deleted successfully!",
    })
})

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

function generateResetPasswordEmailTemplate(resetPasswordUrl) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #e53935; text-align: center;">Reset Your Password</h2>

        <p style="font-size: 16px; color: #333;">Dear User,</p>

        <p style="font-size: 16px; color: #333;">
        You requested to reset your password. Click the button below to proceed:
        </p>

        <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPasswordUrl}"
            style="display: inline-block; font-size: 18px; font-weight: bold; color: #ffffff; padding: 12px 24px; background-color: #e53935; text-decoration: none; border-radius: 5px;">
            Reset Password
        </a>
        </div>

        <p style="font-size: 16px; color: #333;">
        This link will expire in 15 minutes.
        </p>

        <p style="font-size: 16px; color: #333;">
        If you did not request a password reset, please ignore this email. Your account remains secure.
        </p>

        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">
            This is an automated message. Please do not reply to this email.
        </p>
        </footer>
    </div>
    `;
}

function generateEmailChangeTemplate(confirmUrl) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #6C3CE1; text-align: center;">Confirm Email Change</h2>
            <p style="font-size: 16px; color: #333;">Dear User,</p>
            <p style="font-size: 16px; color: #333;">Click the button below to confirm your new email address. This link expires in 15 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmUrl}" style="display: inline-block; font-size: 16px; font-weight: bold; color: #fff; background-color: #6C3CE1; padding: 12px 28px; border-radius: 6px; text-decoration: none;">
                    Confirm New Email
                </a>
            </div>
            <p style="font-size: 14px; color: #666;">If you did not request this change, please ignore this email. Your current email will remain unchanged.</p>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>Thank you,<br>Paiyya Team</p>
                <p>This is an automated message. Please do not reply.</p>
            </footer>
        </div>
    `;
}

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, phone } = req.body;
    const user = req.user;
    let updated = false;

    // ── Name ─────────────────────────────────────────────────────
    if (name !== undefined) {
        if (!name.trim()) {
            return next(new ErrorHandler("Name cannot be empty.", 400));
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 50) {
            return next(new ErrorHandler("Name must be between 2 and 50 characters.", 400));
        }

        if (!/^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]{2,})*$/.test(trimmedName)) {
            return next(new ErrorHandler("Name can only contain letters, spaces, hyphens, and apostrophes.", 400));
        }

        if (user.name !== trimmedName) {
            user.name = trimmedName;
            updated = true;
        }
    }

    // ── Phone ─────────────────────────────────────────────────────
    if (phone !== undefined) {
        const trimmedPhone = phone.trim();
        const phoneError = validatePhone(trimmedPhone);
        if (phoneError) return next(new ErrorHandler(phoneError, 400));

        if (user.phone !== trimmedPhone) {
            user.phone = trimmedPhone;
            updated = true;
        }
    }

    if (!updated) {
        return next(new ErrorHandler("No changes detected.", 400));
    }

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }
    });
});

export const requestEmailChange = catchAsyncError(async (req, res, next) => {
    const { newEmail } = req.body;

    if (!newEmail || !newEmail.trim()) {
        return next(new ErrorHandler("New email is required.", 400));
    }

    const emailError = validateEmail(newEmail);
    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    const user = req.user;

    if (user.email === newEmail.toLowerCase().trim()) {
        return next(new ErrorHandler("New email must be different from current email.", 400));
    }

    // Check if new email is already taken
    const existingUser = await User.findOne({ email: newEmail.toLowerCase().trim() });
    if (existingUser) {
        return next(new ErrorHandler("An account with this email already exists.", 409));
    }

    // Generate token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Need full user document to save — req.user is a lean selected document
    const fullUser = await User.findById(user._id);
    fullUser.pendingEmail = newEmail.toLowerCase().trim();
    fullUser.emailChangeToken = hashedToken;
    fullUser.emailChangeTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await fullUser.save({ validateModifiedOnly: true });

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email-change?token=${rawToken}`;

    try {
        await sendEmailChangeLink(confirmUrl, newEmail);
        return res.status(200).json({
            success: true,
            message: "A verification link has been sent to your new email address.",
        });
    } catch (error) {
        fullUser.pendingEmail = undefined;
        fullUser.emailChangeToken = undefined;
        fullUser.emailChangeTokenExpire = undefined;
        await fullUser.save({ validateModifiedOnly: true });
        return next(new ErrorHandler("Failed to send verification email. Please try again.", 500));
    }
});