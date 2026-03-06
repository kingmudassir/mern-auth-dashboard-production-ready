import cron from "node-cron"
import { User } from "../models/userSchema.js"

cron.schedule("0 0 * * *", async () => {
    try {
        const now = new Date()

        const result = await User.deleteMany({
            deleteAccountRequestAt: { $lte: now }
        });

        console.log(`[${new Date().toISOString()}] Deleted accounts:`, result.deletedCount);

    } catch (error) {
        console.error("Error deleting scheduled accounts:", error);
    }
})