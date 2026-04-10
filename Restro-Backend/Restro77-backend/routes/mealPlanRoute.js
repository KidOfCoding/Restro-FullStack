import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    addMealPlan,
    listMealPlans,
    removeMealPlan,
    subscribeToPlan,
    verifySubscriptionPayment,
    getUserSubscriptions,
    getAllSubscriptions,
    cancelSubscription
} from "../controllers/mealPlanController.js";

const mealPlanRouter = express.Router();

// Admin Routes for Plans (In reality, addMealPlan might have an admin middleware, but following the existing pattern we keep it simple or protected as needed)
mealPlanRouter.post("/add", addMealPlan);
mealPlanRouter.get("/list", listMealPlans);
mealPlanRouter.post("/remove", removeMealPlan);

// User Subscription Endpoints
mealPlanRouter.post("/subscribe", authMiddleware, subscribeToPlan);
mealPlanRouter.post("/verify", authMiddleware, verifySubscriptionPayment);
mealPlanRouter.post("/user-subscriptions", authMiddleware, getUserSubscriptions);
mealPlanRouter.post("/cancel", authMiddleware, cancelSubscription);

// Admin Subscription Endpoint
mealPlanRouter.get("/all-subscriptions", getAllSubscriptions);

export default mealPlanRouter;
