import mongoose from 'mongoose'

const devOrderSchema = new mongoose.Schema(
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
        prepTime: { type: Number, default: 0 },
        statusDate: { type: Date, default: Date.now }
    }
)

const devOrderModel = mongoose.model.devOrder || mongoose.model("dev_order", devOrderSchema)

export default devOrderModel
