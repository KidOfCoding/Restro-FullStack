import deliveryBoyModel from "../models/deliveryBoyModel.js";

// Add new delivery boy
const addDeliveryBoy = async (req, res) => {
    const { name, phone } = req.body;
    try {
        const newBoy = new deliveryBoyModel({ name, phone });
        await newBoy.save();
        res.json({ success: true, message: "Delivery Boy Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// List all delivery boys
const listDeliveryBoys = async (req, res) => {
    try {
        const boys = await deliveryBoyModel.find({});
        res.json({ success: true, data: boys });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove delivery boy
const removeDeliveryBoy = async (req, res) => {
    try {
        await deliveryBoyModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Delivery Boy Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addDeliveryBoy, listDeliveryBoys, removeDeliveryBoy };
