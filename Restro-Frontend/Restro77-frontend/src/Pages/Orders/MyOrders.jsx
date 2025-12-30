import React, { useContext, useState, useEffect } from 'react'
import styles from "./myOrder.module.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import confetti from 'canvas-confetti'
import { useLocation } from 'react-router-dom'
import { assets } from "../../assets/assets";
import { FaRupeeSign } from "react-icons/fa";
// import { io } from 'socket.io-client'; // Import socket.io-client

const timeAgo = (dateParam) => {
    if (!dateParam) return null;
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const today = new Date();
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 90) return 'about a minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
};

const OrderTimer = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        // Run timer if prepTime is set AND status is either "Getting Ready" or "Out for delivery"
        const validStatuses = ["Food is Getting Ready!", "Out for delivery"];

        if (validStatuses.includes(order.status) && order.prepTime > 0) {
            // Use statusDate if available (new logic), otherwise fallback to date (legacy/fallback)
            const baseTime = order.statusDate ? new Date(order.statusDate).getTime() : new Date(order.date).getTime();
            const targetTime = baseTime + order.prepTime * 60000;

            const calculateTime = () => {
                const now = new Date().getTime();
                const difference = targetTime - now;

                if (difference <= 0) {
                    setTimeLeft("Arriving Soon");
                    return false; // Stop interval
                } else {
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                    setTimeLeft(`${minutes}m ${seconds}s`);
                    return true; // Continue
                }
            };

            // Initial call
            if (calculateTime()) {
                const interval = setInterval(() => {
                    if (!calculateTime()) clearInterval(interval);
                }, 1000);
                return () => clearInterval(interval);
            }
        } else {
            setTimeLeft(null);
        }
    }, [order]); // Re-run if order updates

    if (!timeLeft) return null;

    return (
        <p style={{ color: 'tomato', fontWeight: 'bold' }}>
            Arriving in: {timeLeft}
        </p>
    );
};

const MyOrders = () => {
    const { URl, token } = useContext(StoreContext)
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        if (!token) return;
        const response = await axios.post(URl + "/api/order/userorders", {}, { headers: { token } })
        setData(response.data.data)
        // console.log("Fetched Orders:", response.data.data); 
    }

    useEffect(() => {
        if (token) {
            fetchOrders();

            /* Uncomment for DigitalOcean */
            /*
            const socket = io(URl);

            socket.on("connect", () => {
                console.log("Socket Connected:", socket.id);
            });

            socket.on("orderStatusUpdated", (data) => {
                console.log("Order Status Updated (Client):", data);
                fetchOrders(); // Refresh orders on update
            });

            return () => {
                socket.disconnect();
            }
            */
        }
    }, [token, URl])

    return (
        <div className={styles.myorders}>
            <h2>My Orders</h2>
            <div className={styles.container}>
                {data.map((order, index) => {
                    return (
                        <div key={index} className={styles.myordersOrder}>
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                } else {
                                    return item.name + " x " + item.quantity + ","
                                }
                            })}</p>
                            <p><FaRupeeSign />{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <p>Type: <b>{order.orderType || "Delivery"}</b></p>
                                <p style={{ fontSize: '12px', color: '#888' }}>{timeAgo(order.date)}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <p><span>&#x25cf;</span> <b>{order.status}</b> </p>
                                <OrderTimer order={order} />
                            </div>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
