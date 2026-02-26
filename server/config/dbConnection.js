import mongoose from "mongoose";

const connection = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            dbName: "MERN_Authentication"
        })

        console.log("Database is successfully connected!")
    } catch (error) {
        console.error(
            "MongoDB connected failed: ",
            error.name,
            error.message,
            error.stack
        )

        process.exit(1)
    }
}

export default connection