import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";

import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import deliveryRouter from "./routes/deliveryRoute.js";
import deliveryBoyRouter from "./routes/deliveryBoyRoute.js";

import { Server } from "socket.io";
import { createServer } from "http";

// app configurations
const app = express();
const port = process.env.PORT || 4000;

// CORS - Must be first middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ["https://www.restro77.com", "https://restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174", "http://localhost:4000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "Origin", "X-Requested-With", "Accept"]
}));

app.options('*', cors());

// Initialize Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ["https://www.restro77.com", "https://restro77.com", "https://admin.restro77.com", "http://localhost:5173", "http://localhost:5174", "http://localhost:4000"],
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

// middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// DB Connection 
connectDB();

// API Endpoint 
app.use("/api/food", foodRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/user', userRouter)
app.use('/api/delivery', deliveryRouter)
app.use('/api/deliveryBoy', deliveryBoyRouter)

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