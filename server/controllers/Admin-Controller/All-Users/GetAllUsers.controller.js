import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { User } from "../../../models/userSchema.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    
    // -----------------------------
    // Date: start of today
    // -----------------------------
    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    // -----------------------------
    // Counts
    // -----------------------------
    const totalUsers = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false
    });

    const totalBannedUsers = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false,
        isBanned: true
    });

    const deleteRequests = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false,
        deleteAccountRequestAt: { $ne: null }
    });

    const usersJoinedToday = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false,
        createdAt: { $gte: startOfToday }
    });

    // -----------------------------
    // Users list
    // -----------------------------
    const users = await User.find({
        isAccountVerified: true,
        role: "user",
        isDeleted: false
    })
        .sort({ createdAt: -1 })
        .select('name email phone role isAccountVerified isEmailVerified isBanned deleteAccountRequestAt isDeleted createdAt');

    console.log(totalUsers)

    // -----------------------------
    // Response
    // -----------------------------
    res.status(200).json({
        success: true,
        count: users.length,
        stats: {
            totalUsers,
            totalBannedUsers,
            deleteRequests,
            usersJoinedToday
        },
        users
    });
});