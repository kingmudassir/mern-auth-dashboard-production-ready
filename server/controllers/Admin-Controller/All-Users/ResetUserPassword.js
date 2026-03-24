import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";
import { validatePasswordStrict } from "../../../utilities/Validators/PasswordValidator.js";

export const resetUserPassword = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return next(new ErrorHandler("New password is required.", 400));
    }

    const passwordError = validatePasswordStrict(newPassword);
    if (passwordError) {
        return next(new ErrorHandler(passwordError, 400));
    }

    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("Use your own password settings to change your password.", 403));
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "User password reset successfully.",
    });
});
