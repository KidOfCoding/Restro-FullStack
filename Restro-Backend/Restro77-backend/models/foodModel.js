import mongoose, { mongo } from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        type: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            required: true
        },
        variants: [
            {
                name: { type: String }, // e.g., "Half", "Full"
                price: { type: Number }
            }
        ]
    }
)

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;