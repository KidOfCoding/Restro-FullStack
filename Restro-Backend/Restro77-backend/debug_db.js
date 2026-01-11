
import mongoose from "mongoose";
import 'dotenv/config';
import foodModel from "./models/foodModel.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DBurl);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
}

const run = async () => {
    await connectDB();

    console.log("Searching for 'Combo' items...");
    const items = await foodModel.find({
        $or: [
            { name: { $regex: 'Combo', $options: 'i' } },
            { category: { $regex: 'Combo', $options: 'i' } }
        ]
    });

    console.log(`Found ${items.length} items:`);
    items.forEach(i => {
        console.log(`- Name: "${i.name}", Category: "${i.category}", ID: ${i._id}`);
    });

    // Also check total count to ensure DB access works
    const count = await foodModel.countDocuments();
    console.log(`Total documents in collection: ${count}`);

    process.exit(0);
};

run();
