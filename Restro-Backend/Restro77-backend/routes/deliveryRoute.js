import express from "express";
import { addDeliveryPoint, getDeliveryPoints, removeDeliveryPoint } from "../controllers/deliveryController.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/add", addDeliveryPoint);
deliveryRouter.post("/remove", removeDeliveryPoint);
deliveryRouter.get("/list", getDeliveryPoints);

export default deliveryRouter;
