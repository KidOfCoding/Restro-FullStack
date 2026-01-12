import orderModel from "../models/orderModel.js";
import devOrderModel from "../models/devOrderModel.js";
import userModel from "../models/userModel.js"
import Razorpay from "razorpay";
import crypto from "crypto";


// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing user order
const placeOrder = async (req, res) => {


    try {
        const { userId, items, amount, address, pointsToUse, orderType } = req.body;

        let newOrderData = {
            userId,
            items,
            amount,
            address,
            pointsUsed: 0,
            pointsEarned: Math.floor(amount / 50),
            orderType: orderType || "Delivery"
        };

        // Handle Points Redemption
        if (pointsToUse > 0) {
            const user = await userModel.findById(userId);
            if (user.points >= pointsToUse) {
                user.points -= pointsToUse;
                await user.save();
                newOrderData.pointsUsed = pointsToUse;
            } else {
                return res.json({ success: false, message: "Insufficient Points" });
            }
        }

        // Optional: Check for Payment Bypass (Admin Only)
        if (req.body.bypassPayment) {
            const user = await userModel.findById(userId);
            if (user && user.phone === "8596962616") {
                newOrderData.payment = true; // Mark as paid immediately
                const newOrder = new orderModel(newOrderData);
                await newOrder.save();

                // Add Reward Points immediately for Admin Bypass
                if (newOrderData.pointsEarned > 0) {
                    user.points += newOrderData.pointsEarned;
                    await user.save();
                }

                // Clear user cart
                await userModel.findByIdAndUpdate(userId, { cartData: {} });

                // Emit updates
                const io = req.app.get('socketio');
                io.emit("orderStatusUpdated", { orderId: newOrder._id, payment: true });
                io.emit("newOrder", newOrder);

                return res.json({
                    success: true,
                    orderId: newOrder._id,
                    message: "Order placed successfully (Payment Bypassed)",
                    pointsEarned: newOrderData.pointsEarned
                });
            }
        }

        const newOrder = new orderModel(newOrderData);
        await newOrder.save();

        // Clear user cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        // Razorpay Order Creation
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: newOrder._id.toString(),
            payment_capture: 1
        };

        try {
            const order = await razorpay.orders.create(options);



            res.json({
                success: true,
                order,
                key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
                orderId: newOrder._id // Our internal order ID
            });
        } catch (error) {
            console.log("Razorpay Order Error:", error);
            // Rollback order if Razorpay creation fails
            await orderModel.findByIdAndDelete(newOrder._id);
            res.json({ success: false, message: "Payment Initialization Failed: " + error.description || error.message });
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment Successful
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Reward Points
            const order = await orderModel.findById(orderId);
            if (order && order.pointsEarned > 0) {
                const user = await userModel.findById(order.userId);
                user.points += order.pointsEarned;
                await user.save();
            }

            // Emit update
            const io = req.app.get('socketio');
            io.emit("orderStatusUpdated", { orderId: orderId, payment: true });

            // Emit New Order Notification to Admin (Only now, after payment is confirmed)
            io.emit("newOrder", order);

            res.json({ success: true, message: "Payment Verified", pointsEarned: order.pointsEarned });
        } else {
            // Signature Mismatch
            // Refund points if needed
            const order = await orderModel.findById(orderId);
            if (order && order.pointsUsed > 0) {
                const user = await userModel.findById(order.userId);
                user.points += order.pointsUsed;
                await user.save();
            }
            await orderModel.findByIdAndDelete(orderId);

            res.json({ success: false, message: "Payment Verification Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

const verifyOrder = async (req, res) => {
    // This is called by Frontend Verify page to double check / get final status message
    const { orderId, success } = req.body;
    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order Not Found" });
        }

        if (order.payment === true) {
            res.json({ success: true, message: "Paid", pointsEarned: order.pointsEarned })
        } else {
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// user Orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, payment: true }).sort({ date: -1 })
        res.json({ success: true, data: orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


// All orders for Admin
const listOrders = async (req, res) => {
    try {
        // Sort by date descending (-1) so newest appear first
        const orders = await orderModel.find({ payment: true }).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


// Update Order Status
const updateStatus = async (req, res) => {
    try {
        const updateData = {
            status: req.body.status,
            statusDate: Date.now()
        };

        if (req.body.prepTime) {
            updateData.prepTime = req.body.prepTime;
        }

        if (req.body.deliveryBoy) {
            updateData.deliveryBoy = req.body.deliveryBoy;
        }

        await orderModel.findByIdAndUpdate(req.body.orderId, updateData);

        // Include prepTime in the emit so specific order listeners get it
        const io = req.app.get('socketio');
        io.emit("orderStatusUpdated", {
            orderId: req.body.orderId,
            status: updateData.status,
            prepTime: updateData.prepTime,
            statusDate: updateData.statusDate,
            deliveryBoy: updateData.deliveryBoy
        });

        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

// Move Order to DevCollection (Stealth Delete)
const moveToDev = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Create new Dev Order
        const newDevOrder = new devOrderModel(order.toObject());
        // Remove _id to let mongo generate a new one, or keep it? 
        // Better to keep it unique if possible, but moving between collections usually safe to keep ID if duplication isn't an issue.
        // Actually, let's keep the ID but mongo might complain if we try to save with same _id if there was overlap, but there isn't.
        // Safer to just spread details and remove _id if we want a fresh start, but keeping ID helps track it.
        // Mongoose document.toObject() includes _id.
        // To be safe and treat it as a "new" entry in dev, let's allow it to have the same ID.
        newDevOrder._id = order._id;
        newDevOrder.isNew = true; // Force insert

        await newDevOrder.save();

        // Delete from original
        await orderModel.findByIdAndDelete(orderId);

        // EMIT removal event so it disappears from ALL admin panels immediately
        const io = req.app.get('socketio');
        io.emit("orderRemoved", { orderId: orderId });

        res.json({ success: true, message: "Order moved to Dev" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error moving order" });
    }
}

// Get Dev Orders for User
const userDevOrders = async (req, res) => {
    try {
        const orders = await devOrderModel.find({ userId: req.body.userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching dev orders" });
    }
}

export { placeOrder, verifyOrder, verifyRazorpay, userOrders, updateStatus, listOrders, moveToDev, userDevOrders }