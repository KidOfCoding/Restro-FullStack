import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import { sha512 } from 'js-sha512';
import { io } from "../server.js"; // Import io instance

// Placing user order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const { userId, items, amount, address, pointsToUse } = req.body;

        let newOrderData = {
            userId,
            items,
            amount,
            address,
            pointsUsed: 0,
            pointsEarned: Math.floor(amount / 50)
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

        const newOrder = new orderModel(newOrderData);
        await newOrder.save();

        // Clear user cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        // PayU Configuration
        const txnid = newOrder._id.toString();
        const productinfo = "Food Order";
        const firstname = address.firstName || "User";
        const email = address.email || "test@test.com";
        const phone = address.phone || "9999999999";
        // Ensure amount is float/string as needed by PayU, but usually standard float is fine.

        const payu_key = process.env.PAYU_KEY;
        const payu_salt = process.env.PAYU_SALT;
        const surl = `http://localhost:4000/api/order/verify-payu`; // Backend Callback
        const furl = `http://localhost:4000/api/order/verify-payu`; // Backend Callback

        // Hash Formula: key|txnid|amount|productinfo|firstname|email|||||||||||salt
        const hashString = `${payu_key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payu_salt}`;
        const hash = sha512(hashString);

        // Emit new order event (although typically valid only after payment for paid orders, 
        // but for listing it might be useful to see 'pending' ones or wait for verify)
        // Let's emit it so Admin sees it immediately as "Food Processing" once placed? 
        // Actually, status is "Food Processing" default? No, schema default usually.
        // Assuming default is "Food Processing".
        io.emit("newOrder", newOrder);

        res.json({
            success: true,
            payuParams: {
                key: payu_key,
                txnid: txnid,
                amount: amount,
                productinfo: productinfo,
                firstname: firstname,
                email: email,
                phone: phone,
                surl: surl,
                furl: furl,
                hash: hash
            }
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Handle PayU Callback (SURL/FURL)
const verifyPayU = async (req, res) => {
    const { txnid, status, hash, key, productinfo, amount, email, firstname } = req.body;
    const payu_salt = process.env.PAYU_SALT;

    // Hash Validation Formula for Response: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
    // Note: status is first.
    // If param is missing, use empty string? PayU standard usually guarantees these main ones.

    // Check if status is success
    if (status === 'success') {
        // Re-calculate hash to verify source
        const hashString = `${payu_salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
        const calculatedHash = sha512(hashString);

        if (calculatedHash === hash) {
            // Payment Successful and Verified
            await orderModel.findByIdAndUpdate(txnid, { payment: true });

            // Credit Points logic if needed (duplicate from old verifyOrder)
            // Fetch order to check pointsEarned
            const order = await orderModel.findById(txnid);
            if (order && order.pointsEarned > 0) {
                const user = await userModel.findById(order.userId);
                user.points += order.pointsEarned;
                await user.save();
            }

            // Emit update to ensure it shows as Paid
            io.emit("orderStatusUpdated", { orderId: txnid, payment: true });

            // Redirect to frontend success
            return res.redirect(`http://localhost:5173/verify?success=true&orderId=${txnid}`);
        }
    }

    // If failed or hash mismatch
    // Refund points if needed
    const order = await orderModel.findById(txnid);
    if (order && order.pointsUsed > 0) {
        const user = await userModel.findById(order.userId);
        user.points += order.pointsUsed;
        await user.save();
    }
    await orderModel.findByIdAndDelete(txnid);

    return res.redirect(`http://localhost:5173/verify?success=false&orderId=${txnid}`);
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
        const orders = await orderModel.find({ userId: req.body.userId })
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
        const orders = await orderModel.find({}).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })

        // Emit Status Update
        io.emit("orderStatusUpdated", { orderId: req.body.orderId, status: req.body.status });

        res.json({ success: true, message: "Status Updated!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

export { placeOrder, verifyOrder, verifyPayU, userOrders, updateStatus, listOrders }