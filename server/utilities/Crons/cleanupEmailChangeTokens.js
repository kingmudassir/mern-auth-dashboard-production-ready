import cron from "node-cron";
import { User } from "../../models/userSchema.js";

cron.schedule("0 0 * * *", async () => {
    try {
        const now = Date.now();

        const result = await User.updateMany(
        {
            emailChangeTokenExpire: { $lte: now }
        },
        {
            $unset: {
            emailChangeToken: "",
            emailChangeTokenExpire: "",
            pendingEmail: ""
            }
        }
        );

        console.log(
        `[${new Date().toISOString()}] Cleared expired email change tokens:`,
        result.modifiedCount
        );

    } catch (error) {
        console.error("Error clearing email change tokens:", error);
    }
});