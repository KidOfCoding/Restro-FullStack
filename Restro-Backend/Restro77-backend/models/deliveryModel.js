import mongoose from "mongoose";

const deliveryPointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    defaultDistance: { type: Number, required: true }, // in km
    baseCost: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { minimize: false, timestamps: true });

const deliveryPointModel = mongoose.models.deliveryPoint || mongoose.model("deliveryPoint", deliveryPointSchema);

export default deliveryPointModel;
