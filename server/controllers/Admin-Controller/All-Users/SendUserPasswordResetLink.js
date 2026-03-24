import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";
import { sendEmail } from "../../../utilities/sendEmail.js";

const generateAdminResetPasswordEmailTemplate = (resetPasswordUrl) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    
    <h2 style="color: #6C3CE1; text-align: center;">Admin Password Reset</h2>

    <p style="font-size: 16px; color: #333;">Dear User,</p>

    <p style="font-size: 16px; color: #333;">
        An administrator has requested a password reset for your account.
    </p>

    <p style="font-size: 16px; color: #333;">
        Click the button below to set a new password:
    </p>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPasswordUrl}"
            style="display: inline-block; font-size: 18px; font-weight: bold; color: #ffffff; padding: 12px 24px; background-color: #6C3CE1; text-decoration: none; border-radius: 5px;">
            Reset Password
        </a>
    </div>

    <p style="font-size: 16px; color: #333;">
        This link will expire shortly for security reasons.
    </p>

    <p style="font-size: 16px; color: #333;">
        If you were not expecting this, contact support immediately. Do not ignore this email.
    </p>

    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Regards,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">
            This is an automated message. Please do not reply to this email.
        </p>
    </footer>

</div>
`;

export const sendUserPasswordResetLink = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (!user.isAccountVerified || !user.isEmailVerified) {
        return next(new ErrorHandler("User account/email must be verified to send reset link.", 400));
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateModifiedOnly: true });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateAdminResetPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateModifiedOnly: true });
        return next(new ErrorHandler(`Failed to send reset email: ${error.message}`, 500));
    }

    res.status(200).json({
        success: true,
        message: "Password reset link sent successfully.",
    });
});
