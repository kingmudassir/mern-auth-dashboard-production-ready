import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";

export const getUserById = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
        .select('-password -refreshToken -resetPasswordToken -emailVerificationCode -__v');

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});