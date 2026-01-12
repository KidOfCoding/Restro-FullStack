import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }
})

const deliveryBoyModel = mongoose.models.deliveryBoy || mongoose.model("deliveryBoy", deliveryBoySchema);

export default deliveryBoyModel;
