import cron from "node-cron";
import { User } from "../models/userSchema.js";

cron.schedule("0 0 * * *", async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const result = await User.deleteMany({
            isAccountVerified: false,
            createdAt: { $lte: twentyFourHoursAgo }
        });

        console.log(`[${new Date().toISOString()}] Cleanup complete:`, result.deletedCount, "users deleted.");
    } catch (error) {
        console.error("Error cleaning unverified users:", error);
    }
});