import express from 'express'
import { addPoints, getAddress, getProfile, getUser, loginUser, registerUser, updateaddress, updateProfile, saveAddress, deleteAddress, adminLogin } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post('/addpoints', addPoints);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, updateProfile);
userRouter.put("/updateAddress", authMiddleware, updateaddress);
userRouter.get("/get-address", authMiddleware, getAddress);
userRouter.get("/getuser", getUser);
userRouter.post("/save-address", authMiddleware, saveAddress);
userRouter.post("/delete-address", authMiddleware, deleteAddress);
userRouter.post("/admin/login", adminLogin);

export default userRouter;