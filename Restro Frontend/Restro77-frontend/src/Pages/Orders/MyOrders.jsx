import React, { useContext, useState, useEffect } from 'react'
import styles from "./myOrder.module.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import confetti from 'canvas-confetti'
import { useLocation } from 'react-router-dom'
import { assets } from "../../assets/assets";
import { FaRupeeSign } from "react-icons/fa";
import { io } from 'socket.io-client'; // Import socket.io-client

const MyOrders = () => {
    const { URl, token } = useContext(StoreContext)
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(URl + "/api/order/userorders", {}, { headers: { token } })
        setData(response.data.data)
        console.log(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();

            // Connect to Socket via Backend URL
            // Ensure URl doesn't have trailing slash issues, but standard is fine
            const socket = io(URl);

            socket.on("orderStatusUpdated", (data) => {
                console.log("Order Status Updated:", data);
                fetchOrders(); // Refresh orders on update
            });

            return () => {
                socket.disconnect();
            }
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
                            <p><span>&#x25cf;</span> <b>{order.status}</b> </p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
