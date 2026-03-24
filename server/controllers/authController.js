import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errors.js";
import validator from "validator"
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utilities/sendEmail.js";
import crypto from "crypto";
import { sendToken } from "../utilities/sendToken.js";
import { validatePhone } from "../utilities/Validators/PhoneValidator.js";
import { sendEmailChangeLink } from "../utilities/sendEmailChange.js";
import { validatePasswordStrict } from "../utilities/Validators/PasswordValidator.js"
import { validateEmail } from "../utilities/Validators/EmailValidator.js";
import { validateName } from "../utilities/Validators/NameValidator.js";

const validate = (name, email, password, phone) => {
    const nameError = validateName(name);
    if (nameError) return nameError;

    const emailResult = validateEmail(email);
    if (typeof emailResult === "string") {
        return emailResult;
    }

    const passwordError = validatePasswordStrict(password);
    if (passwordError) return passwordError;

    const phoneError = validatePhone(phone);
    if (phoneError) return phoneError;

    return null
}

export const register = catchAsyncError(async (req, res, next) => {
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
    const message = generateEmailTemplate(verificationCode);
    await sendEmail({ email, subject: "Your verification code", message });
}

export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { password, confirmPassword } = req.body;

    if (!req.params.token)
        return next(new ErrorHandler("Invalid reset request", 400));

    if (!password || !confirmPassword)
        return next(new ErrorHandler("Password fields are required", 400));

    const passwordError = validatePasswordStrict(password);
    if (passwordError) return next(new ErrorHandler(passwordError, 400));

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
    await existingUser.save({ validateModifiedOnly: true })

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
        await existingUser.save({ validateModifiedOnly: true });

        throw new ErrorHandler(`Failed to send verification email: ${error.message}`, 500);
    }
})

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, rememberMe } = req.body

    const emailError = validateEmail(email);

    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    if (!password) {
        return next(new ErrorHandler("Incorrect email or password.", 401));
    }

    const existingUser = await User.findOne({
        email,
        isAccountVerified: true
    }).select("+password")

    // first check if user exists
    if (!existingUser) {
        return next(new ErrorHandler("Incorrect email or password", 401));
    }

    if (existingUser.isDeleted) {
        return next(new ErrorHandler("This account has been deleted.", 403));
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

    existingUser.lastLoginAt = new Date();
    await existingUser.save({ validateModifiedOnly: true });

    sendToken(existingUser, 200, "User logged in successfully.", res, rememberMe);
})

export const logout = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.refreshToken = undefined;
        user.refreshTokenExpire = undefined;
        await user.save({ validateModifiedOnly: true });
    }

    res.status(200)
    .cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,                
        sameSite: "strict",
        path: "/"
    })
    .cookie("refreshToken", "", {
        expires: new Date(0),
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

export const deleteAccount = catchAsyncError(async (req, res, next) => {
    const { currentPassword } = req.body

    if (!currentPassword) {
        return next(new ErrorHandler("Password is required.", 400));
    }

    const existingUser = await User.findById(req.user._id).select("+password")

    if (!existingUser) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Check if deletion is paused (user recently cancelled a deletion request)
    const now = new Date();
    if (existingUser.deletionPausedUntil && now <= existingUser.deletionPausedUntil) {
        const remainingMs = existingUser.deletionPausedUntil - now;
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
        return res.status(403).json({
            success: false,
            message: `Account deletion is paused for ${remainingDays} more day(s).`
        });
    }

    const isMatch = await existingUser.comparePassword(currentPassword)
    if (!isMatch) {
        return next(new ErrorHandler("Incorrect password.", 401))
    }

    // Schedule deletion 7 days from now
    existingUser.deleteAccountRequestAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await existingUser.save({ validateModifiedOnly: true });

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "strict",
        path: "/"
    });

    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "strict",
        path: "/"
    });

    res.status(200).json({
        success: true,
        message: "Your account has been scheduled for deletion in 7 days. Log in before then to cancel."
    });
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
    fullUser.emailChangeTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
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

export const confirmEmailChange = catchAsyncError(async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        return next(new ErrorHandler("Invalid or missing token.", 400));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailChangeToken: hashedToken,
        emailChangeTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Token is invalid or has expired.", 400));
    }

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpire = undefined;
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
        success: true,
        message: "Email address updated successfully."
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("All fields are required.", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New passwords do not match.", 400));
    }

    if (currentPassword === newPassword) {
        return next(new ErrorHandler("New password must be different from current password.", 400));
    }

    const passwordError = validatePasswordStrict(newPassword);
    if (passwordError) {
        return next(new ErrorHandler(passwordError, 400));
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return next(new ErrorHandler("Current password is incorrect.", 401));
    }

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
        success: true,
        message: "Password changed successfully."
    });
});

export const getAdminStats = catchAsyncError(async (req, res, next) => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalUsers = await User.countDocuments({ 
        isAccountVerified: true,
        role: "user",
        isDeleted: false
    });

    const usersThisMonth = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false,
        createdAt: { $gte: startOfThisMonth }
    });

    const usersLastMonth = await User.countDocuments({
        isAccountVerified: true,        
        role: "user",
        isDeleted: false,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const userTrend = usersLastMonth === 0
        ? null
        : Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100);

    const recentUsers = await User.find({ 
        isAccountVerified: true,
        role: "user",
        isDeleted: false
    })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('name email createdAt isBanned deleteAccountRequestAt isDeleted');

    res.status(200).json({
        success: true,
        stats: {
            totalUsers,
            usersThisMonth,
            userTrend,
            recentUsers,
        }
    });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({ 
        isAccountVerified: true, 
        role: "user",
        isDeleted: false
    })
        .sort({ createdAt: -1 })
        .select('name email phone role isAccountVerified isEmailVerified isBanned deleteAccountRequestAt isDeleted createdAt');

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

export const getDeletedUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({
        isDeleted: true,
    })
        .sort({ softDeletedAt: -1, updatedAt: -1 })
        .select(
            "name email phone role createdAt isDeleted softDeletedAt deletedBy banReason isBanned"
        );

    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});