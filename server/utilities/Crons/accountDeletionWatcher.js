import cron from "node-cron"
import { User } from "../../models/userSchema.js"

cron.schedule("0 0 * * *", async () => {
    try {
        const now = new Date()

        const result = await User.updateMany(
            { deletionPausedUntil: { $lte: now } },
            { $unset: { deletionPausedUntil: "" } }
        )

        console.log(`[${now.toISOString()}] Removed deletion suspension for ${result.modifiedCount} users.`)


    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error removing deletion suspension:`, error)
    }
})