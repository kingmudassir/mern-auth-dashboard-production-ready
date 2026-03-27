import { catchAsyncError } from "../../../middlewares/catchAsyncError";
import { User } from "../../../models/userSchema";

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