import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";

import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import { Server } from "socket.io"; // Import socket.io
import { createServer } from "http"; // Import http

import rateLimit from 'express-rate-limit'

// app configurations
const app = express();
const port = process.env.PORT || 4000;

// CORS - Must be first middleware
app.use(cors({
    origin: ["https://www.restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token"]
}));

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: ["https://www.restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket connection handler
io.on("connection", (socket) => {
    console.log("New User Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)

//middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// DB Connection 
connectDB();

// API Endpoint 
app.use("/api/food", foodRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/user', userRouter)

// Http Requests
app.get('/', (req, res) => {
    res.send("API Working")
});


// To Run on port 4000
if (process.env.NODE_ENV !== 'production') {
    server.listen(port, () => {
        console.log(`Server Running on http://localhost:${port}`)
    })
}

// Export io for use in controllers
export { io };
export default app;