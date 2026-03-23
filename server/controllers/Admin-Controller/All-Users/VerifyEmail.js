import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";

export const verifyEmail = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    user.isEmailVerified = true
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        user
    });
});