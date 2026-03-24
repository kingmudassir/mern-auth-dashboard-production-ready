import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";

export const softDeleteUser = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot soft-delete your own account.", 403));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (user.isDeleted) {
        return next(new ErrorHandler("User is already soft-deleted.", 400));
    }

    user.isDeleted = true;
    user.softDeletedAt = new Date();
    user.deletedBy = req.user._id;
    user.isBanned = true;
    user.banReason = "Soft deleted by admin";
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    user.deleteAccountRequestAt = undefined;
    user.deletionPausedUntil = undefined;
    user.refreshToken = undefined;
    user.refreshTokenExpire = undefined;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "User soft-deleted successfully.",
        user,
    });
});

export const restoreSoftDeletedUser = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (!user.isDeleted) {
        return next(new ErrorHandler("User is not soft-deleted.", 400));
    }

    user.isDeleted = false;
    user.softDeletedAt = undefined;
    user.deletedBy = undefined;
    user.isBanned = false;
    user.banReason = undefined;
    user.bannedAt = undefined;
    user.bannedBy = undefined;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "User restored successfully.",
        user,
    });
});
