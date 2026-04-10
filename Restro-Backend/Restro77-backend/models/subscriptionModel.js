import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'mealPlan', required: false },
    customPlan: {
        name: { type: String },
        price: { type: Number },
        planType: { type: String }
    },
    payment: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled', 'Pending'], default: 'Pending' },
    startDate: { type: Date },
    endDate: { type: Date },
    paymentDate: { type: Date },
    address: { type: Object, required: true }
}, { timestamps: true });

const subscriptionModel = mongoose.models.subscription || mongoose.model("subscription", subscriptionSchema);

export default subscriptionModel;
