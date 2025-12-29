import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        items: { type: Array, required: true },
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "Food is Getting Ready!" },
        date: { type: Date, default: Date.now },
        payment: { type: Boolean, default: false },
        pointsUsed: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 0 },
        orderType: { type: String, default: "Delivery" },
        prepTime: { type: Number, default: 0 }
    }
)

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema)

export default orderModel