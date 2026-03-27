import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { User } from "../../../models/userSchema.js";

/**
 * Controller: Get Admin Statistics
 * Returns counts and trends for active and banned users along with recent users.
 */
export const getAdminStats = catchAsyncError(async (req, res, next) => {

    // -----------------------------
    // Define date ranges
    // -----------------------------
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const startOfThisWeek = new Date();
    startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
    startOfThisWeek.setHours(0, 0, 0, 0);
    // -----------------------------
    // Total Users
    // -----------------------------
    const totalUsers = await User.countDocuments({ 
        isAccountVerified: true,
        role: "user",
        isBanned: false,
        isDeleted: false
    });

    const totalBannedUsers = await User.countDocuments({ 
        isAccountVerified: true,
        role: "user",
        isBanned: true,
        isDeleted: false
    });

    // -----------------------------
    // Active Users Trend
    // -----------------------------
    const activeUsersThisMonth = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isDeleted: false,
        isBanned: false,
        createdAt: { $gte: startOfThisMonth }
    });

    const activeUsersLastMonth = await User.countDocuments({
        isAccountVerified: true,        
        role: "user",
        isBanned: false,
        isDeleted: false,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const activeUserTrend = activeUsersLastMonth === 0
        ? null
        : Math.round(((activeUsersThisMonth - activeUsersLastMonth) / activeUsersLastMonth) * 100);

    // -----------------------------
    // Banned Users Trend
    // -----------------------------
    const bannedUsersThisMonth = await User.countDocuments({
        isAccountVerified: true,        
        role: "user",
        isDeleted: false,
        isBanned: true,
        createdAt: { $gte: startOfThisMonth }
    });

    const bannedUsersLastMonth = await User.countDocuments({
        isAccountVerified: true,        
        role: "user",
        isDeleted: false,
        isBanned: true,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const bannedUserTrend = bannedUsersLastMonth === 0
        ? null
        : Math.round(((bannedUsersThisMonth - bannedUsersLastMonth) / bannedUsersLastMonth) * 100);

    // -----------------------------
    // Recent Active Users
    // -----------------------------
    const recentUsers = await User.find({ 
        isAccountVerified: true,
        role: "user",
        isBanned: false,
        isDeleted: false
    })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('name email createdAt isBanned deleteAccountRequestAt isDeleted');

    const getTrend = (current, previous) => {
        if (previous === 0 && current === 0) {
            return { percentage: 0, direction: "neutral" };
        }

        if (previous === 0) {
            return { percentage: 100, direction: "up" }; // growth from zero
        }

        const diff = current - previous;
        const percentage = Math.round((diff / previous) * 100);

        let direction = "neutral";
        if (diff > 0) direction = "up";
        if (diff < 0) direction = "down";

        return { percentage, direction };
    };

    const activeTrend = getTrend(activeUsersThisMonth, activeUsersLastMonth);
    const bannedTrend = getTrend(bannedUsersThisMonth, bannedUsersLastMonth);

    // -----------------------------
    // New Users This Week
    // -----------------------------
    const newUsersThisWeek = await User.countDocuments({
        isAccountVerified: true,
        role: "user",
        isBanned: false,
        isDeleted: false,
        createdAt: { $gte: startOfThisWeek }
    });

    const weeklyActivityRaw = await User.aggregate([
        {
            $match: {
            isAccountVerified: true,
            role: "user",
            isDeleted: false,
            isBanned: false,
            createdAt: { $gte: startOfThisWeek }
            }
        },
        {
            $group: {
            _id: { $dayOfWeek: "$createdAt" }, // 1 (Sun) → 7 (Sat)
            users: { $sum: 1 }
            }
        }
    ]);

    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = i + 1; // Mongo: 1–7
        const found = weeklyActivityRaw.find(d => d._id === dayIndex);

        return {
            day: daysMap[i],
            users: found ? found.users : 0,
            // listings: 1
        };
    });
console.log(bannedUsersThisMonth, bannedUsersLastMonth, bannedTrend);
    // -----------------------------
    // Send response
    // -----------------------------
    res.status(200).json({
        success: true,
        stats: {
            totals: {
                users: totalUsers,
                bannedUsers: totalBannedUsers,
            },

            activeUsers: {
                thisMonth: activeUsersThisMonth,
                trend: activeTrend.percentage,
                direction: activeTrend.direction,
            },

            bannedUsers: {
                thisMonth: bannedUsersThisMonth,
                trend: bannedTrend.percentage,
                direction: bannedTrend.direction,
            },

            newUsers: {
                thisWeek: newUsersThisWeek,
            },

            weeklyActivity,
            recentUsers
        }
    });
});