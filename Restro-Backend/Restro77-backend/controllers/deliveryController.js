import deliveryPointModel from "../models/deliveryModel.js";

// Add Delivery Point
const addDeliveryPoint = async (req, res) => {
    try {
        const { name, defaultDistance, baseCost } = req.body;
        const newPoint = new deliveryPointModel({
            name,
            defaultDistance,
            baseCost
        });
        await newPoint.save();
        res.json({ success: true, message: "Delivery Point Added", data: newPoint });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove Delivery Point
const removeDeliveryPoint = async (req, res) => {
    try {
        const { id } = req.body;
        await deliveryPointModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Delivery Point Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Get All Delivery Points
const getDeliveryPoints = async (req, res) => {
    try {
        const points = await deliveryPointModel.find({});
        res.json({ success: true, data: points });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addDeliveryPoint, removeDeliveryPoint, getDeliveryPoints };
