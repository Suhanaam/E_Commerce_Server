import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log(`MONGO_URI from .env: ${MONGO_URI || "❌ NOT FOUND!"}`); // Debugging

export const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("❌ MONGO_URI is undefined! Check your .env file.");
        }
        await connect(MONGO_URI);
        console.log("✅ DB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};
