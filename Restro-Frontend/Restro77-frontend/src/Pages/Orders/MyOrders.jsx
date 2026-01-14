import React, { useContext, useState, useEffect } from 'react'
import styles from "./myOrder.module.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import confetti from 'canvas-confetti'
import { useLocation } from 'react-router-dom'
import { assets } from "../../assets/assets";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { io } from 'socket.io-client'; // Import socket.io-client

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
    const [statusText, setStatusText] = useState("Arriving Soon");

    useEffect(() => {
        // Run timer if prepTime is set AND status is either "Getting Ready" or "Out for delivery"
        const validStatuses = ["Food is Getting Ready!", "Out for delivery"];

        if (validStatuses.includes(order.status) && order.prepTime > 0) {
            const baseTime = order.statusDate ? new Date(order.statusDate).getTime() : new Date(order.date).getTime();
            const targetTime = baseTime + order.prepTime * 60000;

            const calculateTime = () => {
                const now = new Date().getTime();
                const difference = targetTime - now;

                if (difference <= 0) {
                    setTimeLeft("Arrived"); // Marker for loop
                    return false; // Stop interval
                } else {
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                    setTimeLeft(`${minutes}m ${seconds}s`);
                    return true; // Continue
                }
            };

            // Loop logic for "Arriving Soon" <-> "Driver is on the way"
            if (!calculateTime()) {
                // Already arrived/late, start loop immediately
                const loopInterval = setInterval(() => {
                    setStatusText(prev => prev === "Arriving Soon" ? "Driver is on the way" : "Arriving Soon");
                }, 2000);
                return () => clearInterval(loopInterval);
            } else {
                // Still counting down
                const interval = setInterval(() => {
                    if (!calculateTime()) {
                        clearInterval(interval);
                        // Start loop once finished
                        // Note: This won't trigger immediately in this render cycle unless we rethink effects, 
                        // but setTimeLeft("Arrived") will trigger re-render if I handle it right.
                        // Simpler: Just rely on timeLeft state.
                    }
                }, 1000);
                return () => clearInterval(interval);
            }
        } else {
            setTimeLeft(null);
        }
    }, [order]);

    // Effect for the loop text when time is up
    useEffect(() => {
        if (timeLeft === "Arrived") {
            const loop = setInterval(() => {
                setStatusText(prev => prev === "Arriving Soon" ? "Driver is on the way" : "Arriving Soon");
            }, 2000);
            return () => clearInterval(loop);
        }
    }, [timeLeft]);

    if (!timeLeft) return null;

    if (timeLeft === "Arrived") {
        return (
            <p style={{ color: 'tomato', fontWeight: 'bold' }}>
                {statusText}
            </p>
        );
    }

    return (
        <p style={{ color: 'tomato', fontWeight: 'bold' }}>
            Arriving in: {timeLeft}
        </p>
    );
};

const MyOrders = () => {
    const { URl, token, userData } = useContext(StoreContext)
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState("live"); // 'live' or 'dev'

    const fetchOrders = async () => {
        if (!token) return;
        let endpoint = "/api/order/userorders";
        if (viewMode === "dev") {
            endpoint = "/api/order/dev-orders";
        }

        const response = await axios.post(URl + endpoint, { userId: userData?._id }, { headers: { token } })
        setData(response.data.data)
    }

    // Move to Dev (Stealth Delete)
    const moveToDev = async (orderId) => {
        if (!window.confirm("Move this order to Dev (Hidden)?")) return;
        try {
            const res = await axios.post(URl + "/api/order/move-to-dev", { orderId }, { headers: { token } });
            if (res.data.success) {
                // Remove from local state immediately to reflect stealth
                setData(prev => prev.filter(o => o._id !== orderId));
                // Optional: toast.success(res.data.message);
            } else {
                alert("Failed to move order");
            }
        } catch (error) {
            console.error(error);
            alert("Error");
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();

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
        }
    }, [token, URl, viewMode, userData]) // Re-fetch when viewMode changes

    return (
        <div className={styles.myorders}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{viewMode === 'live' ? "My Orders" : "Dev Orders (Hidden)"}</h2>
                {userData?.phone === "8596962616" && (
                    <button
                        onClick={() => setViewMode(prev => prev === 'live' ? 'dev' : 'live')}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: viewMode === 'live' ? '#333' : 'tomato',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {viewMode === 'live' ? "Show Dev Orders" : "Show Live Orders"}
                    </button>
                )}
            </div>
            <div className={styles.container}>
                {data.map((order, index) => {
                    return (
                        <div key={index} className={styles.myordersOrder} style={{ position: 'relative' }}>
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

                            {order.deliveryBoy && order.status === "Out for delivery" && (
                                <div className={styles.deliveryPartnerBox}>
                                    <div>
                                        <p className={styles.deliveryPartnerLabel}>Delivery Partner</p>
                                        <p className={styles.deliveryPartnerName}>{order.deliveryBoy.name}</p>
                                    </div>
                                    <a href={`tel:${order.deliveryBoy.phone}`} className={styles.deliveryPartnerPhone}>
                                        📞 {order.deliveryBoy.phone}
                                    </a>
                                </div>
                            )}

                            {(userData?.phone === "8596962616" && viewMode === 'live') && (
                                <button
                                    onClick={() => moveToDev(order._id)}
                                    title="Stealth Delete"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                        color: '#ff4444',
                                        border: '1px solid #ff4444',
                                        padding: '0',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '24px',
                                        height: '24px',
                                        transition: 'all 0.3s ease',
                                        zIndex: 10
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#ff4444';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                                        e.target.style.color = '#ff4444';
                                    }}
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
