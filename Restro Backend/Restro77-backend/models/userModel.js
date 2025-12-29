// To define user model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    address: { type: String },
    addresses: [
        {
            address: { type: String, required: true },
            label: { type: String, default: 'Home' }
        }
    ],
    cartData: { type: Object, default: {} },
    points: { type: Number, default: 0 },
    phone: { type: String, default: "" }
}, { minimize: false })

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;