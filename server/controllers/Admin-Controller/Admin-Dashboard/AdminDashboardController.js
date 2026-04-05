// ─────────────────────────────────────────────────────────────────
// FILE: controllers/Admin-Controller/Admin-Dashboard/AdminDashboardController.js
// ─────────────────────────────────────────────────────────────────
import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { User } from "../../../models/userSchema.js";
import { Car } from "../../../models/carSchema.js";
import { Report } from "../../../models/reportSchema.js";

export const getAdminStats = catchAsyncError(async (req, res, next) => {

    const now = new Date();
    const startOfThisMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth    = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfThisWeek   = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    // ── Run all counts in parallel ────────────────────────────────
    const [
        totalUsers,
        totalBannedUsers,
        activeUsersThisMonth,
        activeUsersLastMonth,
        bannedUsersThisMonth,
        bannedUsersLastMonth,
        newUsersThisWeek,
        totalActiveListings,
        totalPendingListings,
        activeListingsThisMonth,
        activeListingsLastMonth,
        pendingListingsThisMonth,
        pendingListingsLastMonth,
        openReports,
        recentUsers,
        recentListingsRaw,
        recentReportsRaw,
        weeklyActivityRaw,
        weeklyListingsRaw,
    ] = await Promise.all([
        // Users
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: false, isDeleted: false }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: true,  isDeleted: false }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: false, isDeleted: false, createdAt: { $gte: startOfThisMonth } }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: false, isDeleted: false, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: true,  isDeleted: false, createdAt: { $gte: startOfThisMonth } }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: true,  isDeleted: false, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        User.countDocuments({ isAccountVerified: true, role: "user", isBanned: false, isDeleted: false, createdAt: { $gte: startOfThisWeek } }),

        // Listings
        Car.countDocuments({ status: "active",  isDeleted: false }),
        Car.countDocuments({ status: "pending", isDeleted: false }),
        Car.countDocuments({ status: "active",  isDeleted: false, createdAt: { $gte: startOfThisMonth } }),
        Car.countDocuments({ status: "active",  isDeleted: false, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        Car.countDocuments({ status: "pending", isDeleted: false, createdAt: { $gte: startOfThisMonth } }),
        Car.countDocuments({ status: "pending", isDeleted: false, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),

        // Reports
        Report.countDocuments({ status: "pending" }),

        // Recent Users
        User.find({ isAccountVerified: true, role: "user", isBanned: false, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(6)
            .select("name email createdAt isBanned isDeleted")
            .lean(),

        // Recent Listings
        Car.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("postedBy", "name")
            .select("make model year price city status createdAt images postedBy")
            .lean(),

        // Recent Reports (open only)
        Report.find({ status: "pending" })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("reportedBy", "name")
            .populate("car", "make model year")
            .select("reason priority createdAt reportedBy car")
            .lean(),

        // Weekly users aggregation
        User.aggregate([
            { $match: { isAccountVerified: true, role: "user", isDeleted: false, isBanned: false, createdAt: { $gte: startOfThisWeek } } },
            { $group: { _id: { $dayOfWeek: "$createdAt" }, users: { $sum: 1 } } },
        ]),

        // Weekly listings aggregation
        Car.aggregate([
            { $match: { isDeleted: false, createdAt: { $gte: startOfThisWeek } } },
            { $group: { _id: { $dayOfWeek: "$createdAt" }, listings: { $sum: 1 } } },
        ]),
    ]);

    // ── Helpers ───────────────────────────────────────────────────
    const getTrend = (current, previous) => {
        if (previous === 0 && current === 0) return { percentage: 0, direction: "neutral" };
        if (previous === 0) return { percentage: 100, direction: "up" };
        const diff = current - previous;
        const percentage = Math.round((diff / previous) * 100);
        return { percentage, direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral" };
    };

    const activeTrend  = getTrend(activeUsersThisMonth,   activeUsersLastMonth);
    const bannedTrend  = getTrend(bannedUsersThisMonth,   bannedUsersLastMonth);
    const listingTrend = getTrend(activeListingsThisMonth, activeListingsLastMonth);
    const pendingTrend = getTrend(pendingListingsThisMonth, pendingListingsLastMonth);

    // ── Weekly chart: merge users + listings by day ───────────────
    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = i + 1;
        const uDay = weeklyActivityRaw.find(d => d._id === dayIndex);
        const lDay = weeklyListingsRaw.find(d => d._id === dayIndex);
        return {
            day: daysMap[i],
            users: uDay?.users || 0,
            listings: lDay?.listings || 0,
        };
    });

    // ── Shape recent listings for frontend ────────────────────────
    const fmtPrice = (n) => {
        if (!n) return "PKR 0";
        if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(1)}Cr`;
        if (n >= 100000)   return `PKR ${(n / 100000).toFixed(0)}L`;
        return `PKR ${n.toLocaleString()}`;
    };

    const recentListings = recentListingsRaw.map(l => ({
        _id: l._id,
        title: `${l.year} ${l.make} ${l.model}`,
        price: fmtPrice(l.price),
        seller: l.postedBy || { name: "Unknown" },
        city: l.city,
        status: l.status,
        posted: (() => {
            const diff = Date.now() - new Date(l.createdAt).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 60) return `${mins} min ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs} hr ago`;
            return `${Math.floor(hrs / 24)} days ago`;
        })(),
        img: l.images?.[0]?.url || null,
    }));

    // ── Shape recent reports for dashboard widget ─────────────────
    const recentReports = recentReportsRaw.map(r => ({
        _id: r._id,
        // "type" is what Dashboard.jsx renders — map reason to it
        type: r.reason,
        target: r.car ? `${r.car.year} ${r.car.make} ${r.car.model}` : "Unknown listing",
        reporter: r.reportedBy?.name || "Anonymous",
        priority: r.priority,
        time: (() => {
            const diff = Date.now() - new Date(r.createdAt).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 60) return `${mins} min ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs} hr ago`;
            return `${Math.floor(hrs / 24)} days ago`;
        })(),
    }));

    // ── Response ──────────────────────────────────────────────────
    res.status(200).json({
        success: true,
        stats: {
            totals: {
                users: totalUsers,
                bannedUsers: totalBannedUsers,
                activeListings: totalActiveListings,
                pendingListings: totalPendingListings,
                openReports,
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

            activeListings: {
                thisMonth: activeListingsThisMonth,
                trend: listingTrend.percentage,
                direction: listingTrend.direction,
            },

            pendingListings: {
                thisMonth: pendingListingsThisMonth,
                trend: pendingTrend.percentage,
                direction: pendingTrend.direction,
            },

            newUsers: {
                thisWeek: newUsersThisWeek,
            },

            weeklyActivity,
            recentUsers,
            recentListings,
            recentReports,
        },
    });
});