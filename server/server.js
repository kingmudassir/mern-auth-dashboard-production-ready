import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import app from "./app.js";
import connection from "./config/dbConnection.js";

dotenv.config()

const PORT = process.env.PORT || 5001

const server = async () => { 
    // await connection()

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${PORT}`)
    })
}

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    server-close(() => process.exit(1))
})