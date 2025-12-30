import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return; // Already connected
        }
        await mongoose.connect(process.env.MONGO_DBurl);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}
