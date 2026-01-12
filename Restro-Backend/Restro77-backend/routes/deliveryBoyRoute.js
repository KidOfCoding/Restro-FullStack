import express from "express";
import { addDeliveryBoy, listDeliveryBoys, removeDeliveryBoy } from "../controllers/deliveryBoyController.js";

const deliveryBoyRouter = express.Router();

deliveryBoyRouter.post("/add", addDeliveryBoy);
deliveryBoyRouter.get("/list", listDeliveryBoys);
deliveryBoyRouter.post("/remove", removeDeliveryBoy);

export default deliveryBoyRouter;
