import mealPlanModel from "../models/mealPlanModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Admin: Add a new meal plan
const addMealPlan = async (req, res) => {
    try {
        const { name, description, planType, price, features } = req.body;
        
        let featuresArray = features;
        if (typeof features === 'string') {
           // Basic split if sent as string
           featuresArray = features.split(',').map(f => f.trim());
        }

        const mealPlan = new mealPlanModel({
            name,
            description,
            planType,
            price,
            features: featuresArray
        });

        await mealPlan.save();
        res.json({ success: true, message: "Meal Plan Added Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding meal plan" });
    }
}

// User/Admin: List all meal plans
const listMealPlans = async (req, res) => {
    try {
        const plans = await mealPlanModel.find({});
        res.json({ success: true, data: plans });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error listing plans" });
    }
}

// Admin: Remove a meal plan
const removeMealPlan = async (req, res) => {
    try {
        await mealPlanModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Meal Plan Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing plan" });
    }
}

// User: Subscribe and Pay via Razorpay
const subscribeToPlan = async (req, res) => {
    try {
        const { userId, planId, customPlan, address } = req.body;

        let amountToPay = 0;

        if (customPlan) {
            amountToPay = customPlan.price;
        } else {
            const plan = await mealPlanModel.findById(planId);
            if (!plan) return res.json({ success: false, message: "Plan not found" });
            amountToPay = plan.price;
        }

        const newSubscription = new subscriptionModel({
            userId,
            planId: customPlan ? undefined : planId,
            customPlan,
            address,
            payment: false,
            status: 'Pending'
        });

        await newSubscription.save();

        const options = {
            amount: amountToPay * 100, // paise
            currency: "INR",
            receipt: newSubscription._id.toString(),
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            order: razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID,
            subscriptionId: newSubscription._id
        });
    } catch (error) {
        console.log("Subscription Payment Init Error:", error);
        res.json({ success: false, message: "Failed to initialize payment" });
    }
}

// User: Verify Payment
const verifySubscriptionPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Find subscription and plan details
            const sub = await subscriptionModel.findById(subscriptionId).populate('planId');
            
            const planType = sub.customPlan ? sub.customPlan.planType : sub.planId.planType;

            // Find if user has a CURRENT active subscription to stack the dates
            const latestActiveSub = await subscriptionModel.findOne({ 
                userId: sub.userId, 
                status: 'Active', 
                _id: { $ne: subscriptionId } 
            }).sort({ endDate: -1 });

            let startDate = new Date();
            if (latestActiveSub && latestActiveSub.endDate) {
                const graceDate = new Date(latestActiveSub.endDate);
                graceDate.setDate(graceDate.getDate() + 1); // 1 grace day
                const now = new Date();
                
                // If the payment is made before the grace period ends, stack it!
                if (now <= graceDate) {
                    // The new subscription starts exactly when the last one ends
                    startDate = new Date(latestActiveSub.endDate);
                }
            }

            const endDate = new Date(startDate);
            if (planType === 'Weekly') {
                endDate.setDate(startDate.getDate() + 7);
            } else if (planType === 'Monthly') {
                endDate.setMonth(startDate.getMonth() + 1);
            }

            // Mark as active
            await subscriptionModel.findByIdAndUpdate(subscriptionId, {
                payment: true,
                status: 'Active',
                paymentDate: new Date(),
                startDate: startDate,
                endDate: endDate
            });

            res.json({ success: true, message: "Subscription Activated successfully" });
        } else {
            await subscriptionModel.findByIdAndDelete(subscriptionId);
            res.json({ success: false, message: "Payment Verification Failed" });
        }
    } catch (error) {
        console.log("Verification error:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

// User: Get active subscriptions
const getUserSubscriptions = async (req, res) => {
    try {
        const { userId } = req.body;
        const subs = await subscriptionModel.find({ userId, payment: true }).populate('planId').sort({ createdAt: -1 });

        // Dynamically check and update status if naturally expired
        const now = new Date();
        for (let sub of subs) {
            if (sub.status === 'Active' && new Date(sub.endDate) < now) {
                sub.status = 'Expired';
                await sub.save();
            }
        }

        res.json({ success: true, data: subs });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching your subscriptions" });
    }
}

// Admin: Get all subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subs = await subscriptionModel.find({ payment: true }).populate('planId').populate('userId', 'name email phone').sort({ createdAt: -1 });
        
        const now = new Date();
        for (let sub of subs) {
            if (sub.status === 'Active' && new Date(sub.endDate) < now) {
                sub.status = 'Expired';
                await sub.save();
            }
        }

        res.json({ success: true, data: subs });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching all subscriptions" });
    }
}


export {
    addMealPlan,
    listMealPlans,
    removeMealPlan,
    subscribeToPlan,
    verifySubscriptionPayment,
    getUserSubscriptions,
    getAllSubscriptions
};
