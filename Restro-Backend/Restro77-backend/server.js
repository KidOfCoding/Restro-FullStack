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
// const allowedOrigins = ["https://www.restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : true, // Fallback to reflecting request origin if no env var set
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "Origin", "X-Requested-With", "Accept"]
}));

app.options('*', cors()); // Enable pre-flight for all routes

/*
// Manual Headers Fallback for Preflight (Commented out to prevent duplicate headers)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Handle Preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
*/

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io

const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ["https://www.restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set('socketio', io);

// Socket connection handler
io.on("connection", (socket) => {
    console.log("New User Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Rate Limiting
// Rate Limiting (Removed per user request)
/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)
*/

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


// // To Run on port 4000
// if (process.env.NODE_ENV !== 'production') {
//     server.listen(port, () => {
//         console.log(`Server Running on http://localhost:${port}`)
//     })
// } else {
//     // For Production (DigitalOcean / VPS)
//     server.listen(port, '0.0.0.0', () => {
//         console.log(`Server Running on port ${port}`)
//     })
// }

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});


export { io };
export default app;