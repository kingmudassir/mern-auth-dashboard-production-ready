import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";

export const UpdateUserStatus = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { status, banReason } = req.body;

    if (!['active', 'banned'].includes(status)) {
        return next(new ErrorHandler("Invalid status. Must be 'active' or 'banned'.", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Prevent admin from banning themselves
    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot change your own status.", 403));
    }

    if (status === 'banned') {
        user.isBanned = true;
        user.banReason = banReason ?? undefined;
        user.bannedAt = new Date();
        user.bannedBy = req.user._id;
    } else if (status === 'active') {
        user.isBanned = false;
        user.banReason = undefined;
        user.bannedAt = undefined;
        user.bannedBy = undefined;
    }

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: `User ${status === 'banned' ? 'banned' : 'activated'} successfully.`,
        user
    });
});