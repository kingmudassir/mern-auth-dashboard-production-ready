import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";

export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator'].includes(role)) {
        return next(new ErrorHandler("Invalid role. Must be 'user' or 'admin'.", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot change your own role.", 403));
    }

    user.role = role;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: `User role updated to ${role}.`,
        user
    });
});