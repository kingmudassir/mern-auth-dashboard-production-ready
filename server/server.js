import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connection from "./config/dbConnection.js";
import './config/cloudinary.js'
import "./utilities/Crons/cleanupUnverifiedUsers.js"
import './utilities/Crons/deleteScheduledAccounts.js'
import './utilities/Crons/accountDeletionWatcher.js'


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

startServer()