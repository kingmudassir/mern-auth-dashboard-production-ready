import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "MERN_Authentication"
        })

        console.log("Database is successfully connected!")
    } catch (error) {
        console.error(
            "MongoDB connected failed: ",
            error.name,
            error.message,
        )

        process.exit(1)
    }
}

export default connection