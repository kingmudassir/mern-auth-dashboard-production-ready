import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errors.js";
import { User } from "../models/userSchema.js";
import { validateEmail } from "./authController.js"
import { sendVerificationCode } from "./authController.js"

// -----------------------------
// ACCOUNT / USER DELETION
// -----------------------------
export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { confirmation } = req.body;
    const { id: userId } = req.params; // assuming route is /admin/users/:id

    // Validate confirmation text
    if (confirmation !== "Confirm deletion") {
        return next(new ErrorHandler("You must type 'Confirm deletion' to proceed.", 400));
    }

    // Find the user to delete
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Schedule account deletion 7 days from now
    user.deleteAccountRequestAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: `User ${user.name} scheduled for deletion. Account will be deleted in 7 days.`
    });
});

// -----------------------------
// ACCOUNT / PROFILE UPDATES
// -----------------------------
export const updateName = catchAsyncError(async (req, res, next) => {
    const { newName } = req.body;

    if (!newName || newName.trim().length < 2 || name.trim().length > 50 || !/^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]{2,})*$/.test(newName)) {
        return next(new ErrorHandler("Invalid name.", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.name = newName.trim();
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Name updated successfully.",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

export const updateEmail = catchAsyncError(async (req, res, next) => {
    const { newEmail } = req.body;

    // Use your validateEmail function
    const emailError = validateEmail(newEmail);
    if (emailError) {
        return next(new ErrorHandler(emailError, 400));
    }

    // Check if another user already has this email
    const existing = await User.findOne({ email: newEmail });
    if (existing) {
        return next(new ErrorHandler("Email already in use by another user.", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.email = newEmail;
    const verificationCode = user.generateVerificationCode();
    user.isEmailVerified = false; // require re-verification for new email
    await user.save({ validateModifiedOnly: true });

    try {
        await sendVerificationCode(verificationCode, user.email);
        return res.status(200).json({
            success: true,
            message: "Verification code resent!",
        });
    } catch (error) {
        // If sending fails, cleanup verification code
        user.emailVerificationCode = undefined;
        user.emailVerificationCodeExpire = undefined
        await user.save({ validateModifiedOnly: true });
        return next(
            new ErrorHandler(
                `${error.message} - Verification code sending failed. Try resending again.`,
                500
            )
        );
    };

    // res.status(200).json({
    //     success: true,
    //     message: "Email updated successfully. Please verify your new email.",
    //     user: {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role,
    //         isEmailVerified: user.isEmailVerified,
    //     },
    // });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
    // Update user's role (admin only)
});

// -----------------------------
// AUTHENTICATION / SECURITY
// -----------------------------
export const sendPasswordResetLink = catchAsyncError(async (req, res, next) => {
    // Send password reset link via email
});

export const sendVerificationCode = catchAsyncError(async (req, res, next) => {
    // Send email/SMS verification code
});