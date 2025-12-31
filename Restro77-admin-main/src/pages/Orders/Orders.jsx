import React from 'react'
import './orders.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from "../../assets/assets"
import { FaRupeeSign } from "react-icons/fa";
import { io } from 'socket.io-client';

// Sub-component for individual order items to manage local state (Timer Input)
const OrderItem = ({ order, statusHandler, prepTimeHandler }) => {
  const [prepTime, setPrepTime] = useState(order.prepTime || 0);
  const [isSet, setIsSet] = useState(false); // To toggle button color

  // Update local state if order prop updates (e.g. from socket refresh)
  useEffect(() => {
    setPrepTime(order.prepTime || 0);
  }, [order.prepTime]);

  const handleSetTime = async () => {
    await prepTimeHandler(order._id, prepTime);
    setIsSet(true);
    // Reset color after a while? Or keep it? User said "when pressed it will be golden".
    // Let's keep it golden to show it's "Active/Set".
    setTimeout(() => setIsSet(false), 2000); // Optional: revert or keep. Let's keep it simple.
  };

  return (
    <div className="order-item">
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
          {order.address.firstName + " " + order.address.lastName}
        </p>
        <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '5px' }}>
          <span style={{ fontWeight: 'bold', color: '#eded05' }}>Order No.</span> {order._id.slice(-6).toUpperCase()}
        </div>
        <p className='order-item-date'>
          Order Time: {new Date(order.date).toLocaleString()}
        </p>

        <p className='order-item-type' style={{ fontWeight: 'bold', color: '#ccc', marginTop: '5px' }}>
          Type: {order.orderType || "Delivery"}
        </p>

        {(!order.orderType || order.orderType === "Delivery") ? (
          <div className="order-item-address">
            <p>{order.address.street + ","}</p>
            <p>{[order.address.city, order.address.state, order.address.country, order.address.zipcode].filter(Boolean).join(", ")}</p>
            <p className="order-item-phone">{order.address.phone}</p>
          </div>
        ) : (
          <div className="order-item-address" style={{ color: '#006064', fontWeight: 'bold' }}>
            <p>{order.address.street}</p>
          </div>
        )}
      </div>
      <p>Items : {order.items.length}</p>
      <p><FaRupeeSign />{order.amount}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <select onChange={(event) => { statusHandler(event, order._id) }} value={order.status}>
          <option value="Food is Getting Ready!">Food is Getting Ready!</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Mins"
            style={{ width: '60px', padding: '5px' }}
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
          <button
            onClick={handleSetTime}
            style={{
              backgroundColor: isSet ? '#ffcc00' : 'white', // Golden Yellow when set
              color: isSet ? 'black' : '#333',
              border: isSet ? '1px solid #ffcc00' : '1px solid #ccc',
              padding: '6px 15px',
              cursor: 'pointer',
              borderRadius: '20px', // Pill shape ("toggle bar" style)
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: isSet ? '0 2px 5px rgba(255, 204, 0, 0.4)' : 'none'
            }}
          >
            {isSet ? "Set \u2713" : "Set"}
          </button>
        </div>
        <span style={{ fontSize: '10px', color: '#666' }}>Set Prep Time (Min)</span>
      </div>
    </div>
  );
};

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

      try {
        // Play notification sound
        const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
        audio.play().catch(e => console.log("Audio play failed (interaction needed)", e));

        // Speak the notification
        const customerName = data?.address?.firstName || "Customer";
        const msg = new SpeechSynthesisUtterance(`New order arrived from ${customerName}`);
        window.speechSynthesis.speak(msg);
      } catch (e) {
        console.error("Audio notification failed", e);
      }
    });

    // Listen for Status Updates (sync across tabs)
    socket.on("orderStatusUpdated", () => {
      fetchAllOrders();
    });

    return () => {
      socket.disconnect();
    }
  }, [URl])


  const prepTimeHandler = async (orderId, mins) => {
    const response = await axios.post(URl + "/api/order/status", {
      orderId,
      status: "Out for delivery", // Updated per user request
      prepTime: Number(mins)
    })
    if (response.data.success) {
      toast.success("Prep Time Updated!");
      await fetchAllOrders();
    }
  }

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <OrderItem
            key={index}
            order={order}
            statusHandler={statusHandler}
            prepTimeHandler={prepTimeHandler}
          />
        ))}
      </div>
    </div>
  )
}

export default Orders
