import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DBurl || "mongodb+srv://greatstack:greatstack@cluster0.l3oar.mongodb.net/my-app");
        console.log("DB Connected");

        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log("Index 'username_1' dropped successfully.");
        } catch (error) {
            console.log("Error dropping index (it might not exist):", error.message);
        }

    } catch (error) {
        console.error("DB Connection Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

connectDB();
