import dotenv from "dotenv";
import app from "./app.js";
import connection from "./config/dbConnection.js";
import "./utilities/cleanupUnverifiedUsers.js"
import './utilities/deleteScheduledAccounts.js'

dotenv.config()

const PORT = process.env.PORT || 5001

const startServer = async () => {
    try {
        await connection();

        const server = app.listen(PORT, () => {
        console.log(
            `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        );
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer ()