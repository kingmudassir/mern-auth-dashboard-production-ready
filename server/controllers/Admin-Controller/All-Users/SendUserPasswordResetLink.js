import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";
import { sendEmail } from "../../../utilities/sendEmail.js";

const generateAdminResetPasswordEmailTemplate = (resetPasswordUrl) => `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1A1523;">
  <h2 style="margin: 0 0 12px 0;">Password Reset Requested</h2>
  <p style="margin: 0 0 12px 0;">
    An administrator requested a password reset for your account.
  </p>
  <p style="margin: 0 0 16px 0;">
    Click the button below to set a new password:
  </p>
  <a
    href="${resetPasswordUrl}"
    style="display:inline-block;padding:10px 16px;background:#6C3CE1;color:#fff;text-decoration:none;border-radius:8px;"
  >
    Reset Password
  </a>
  <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 13px;">
    If you did not request this, you can ignore this email.
  </p>
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
