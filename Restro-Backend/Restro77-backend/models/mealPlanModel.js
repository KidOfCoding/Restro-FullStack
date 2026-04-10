import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    planType: { type: String, enum: ['Weekly', 'Monthly'], required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" }, // Can be a URL or file path later
    features: [{ type: String }], // e.g. ["2 Meals/Day", "Free Delivery"]
});

const mealPlanModel = mongoose.models.mealPlan || mongoose.model("mealPlan", mealPlanSchema);

export default mealPlanModel;
