import React, { useContext, useEffect, useState } from 'react'
import './MyRewards.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const MyRewards = () => {
    const { URl, token, userPoints, fetchUserPoints } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(URl + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchUserPoints(token);
            fetchOrders();
        }
    }, [token])

    return (
        <div className='my-rewards'>
            <div className="rewards-header">
                <h2>My Rewards Wallet</h2>
                <div className="points-card">
                    <h3>Current Balance</h3>
                    <h1>{userPoints} <span>Pts</span></h1>
                    <p>1 Point = ₹1</p>
                </div>
            </div>

            <div className="rewards-history">
                <h3>Points History</h3>
                <div className="history-list">
                    {data.map((order, index) => {
                        if (order.pointsEarned > 0 || order.pointsUsed > 0) {
                            return (
                                <div key={index} className="history-item">
                                    <div className="history-left">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3176/3176363.png" alt="" />
                                        <div>
                                            <p>{order.items.map((item, index) => {
                                                if (index === order.items.length - 1) {
                                                    return item.name + " x " + item.quantity
                                                } else {
                                                    return item.name + " x " + item.quantity + ", "
                                                }
                                            })}</p>
                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="history-right">
                                        {order.pointsEarned > 0 && <span className="green">+{order.pointsEarned} Pts</span>}
                                        {order.pointsUsed > 0 && <span className="red">-{order.pointsUsed} Pts</span>}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default MyRewards
