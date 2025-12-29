import React from 'react'
import './orders.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from "../../assets/assets"
import { FaRupeeSign } from "react-icons/fa";

import { io } from 'socket.io-client'; // Import socket.io-client

const Orders = ({ URl }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    const response = await axios.get(URl + "/api/order/list")
    if (response.data.success) {
      setOrders(response.data.data)
      console.log(response.data.data)
    } else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(URl + "/api/order/status", {
      orderId,
      status: event.target.value
    })

    if (response.data.success) {
      await fetchAllOrders()
    }

  }

  useEffect(() => {
    fetchAllOrders();

    // Connect to Socket
    const socket = io(URl);

    // Listen for New Orders
    socket.on("newOrder", (data) => {
      toast.info("New Order Received 🔔"); // Toast notification
      fetchAllOrders(); // Refresh list
    });

    // Listen for Status Updates (sync across tabs)
    socket.on("orderStatusUpdated", () => {
      fetchAllOrders();
    });

    return () => {
      socket.disconnect();
    }
  }, [URl])


  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ","
                  }
                })}
              </p>
              <p className='order-item-name'>
                {
                  order.address.firstName + " " + order.address.lastName
                }
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{[order.address.city, order.address.state, order.address.country, order.address.zipcode].filter(Boolean).join(", ")}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p><FaRupeeSign />{order.amount}</p>
            <select onChange={(event) => { statusHandler(event, order._id) }} value={order.status}>
              <option value="Food is Getting Ready!">Food is Getting Ready!</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
