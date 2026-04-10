import React, { useContext, useEffect, useState } from 'react'
import './MySubscriptions.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { FaCalendarCheck, FaWhatsapp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const MySubscriptions = () => {
    const { URl, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showWelcome, setShowWelcome] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchSubs = async () => {
        try {
            const response = await axios.post(URl + "/api/mealplan/user-subscriptions", {}, { headers: { token } });
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching subscriptions");
        }
    }

    useEffect(() => {
        if (token) {
            fetchSubs();
        }
    }, [token])

    useEffect(() => {
        if (location.state?.fromPayment) {
            setShowWelcome(true);
            // Replace state to avoid pop-up on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state])

    const handleJoinWhatsApp = () => {
        const msgText = `Hi! I am an active subscriber of the Monthly Meal Plan. Please add me to the group.`;
        const whatsappUrl = `https://wa.me/917008939551?text=${encodeURIComponent(msgText)}`;
        window.open(whatsappUrl, '_blank');
    }

    const handleRenewPlan = () => {
        navigate('/meal-plans');
    }

    return (
        <div className='my-subscriptions-premium'>
            {showWelcome && (
                <div className="welcome-overlay">
                    <div className="welcome-modal">
                        <div className="welcome-emoji">🎉</div>
                        <h2>Welcome to Restro 77!</h2>
                        <p>Greeting to our valuable meal subscriber. We're excited to serve you!</p>
                        <button 
                            onClick={() => setShowWelcome(false)} 
                            style={{ 
                                background: 'linear-gradient(135deg, #ff6b4a, #ff8364)', 
                                color: '#fff',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 5px 15px rgba(255, 107, 74, 0.3)'
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            <div className="my-sub-header">
                <h2>Active Subscriptions</h2>
                <p>Manage your ongoing and upcoming meal plans</p>
            </div>
            
            <div className="my-sub-container">
                {data.length === 0 ? (
                    <div className="no-subs">
                        <img src={assets.parcel_icon} alt="No subscriptions"/>
                        <p>You have no active subscriptions.</p>
                        <button 
                            onClick={() => navigate('/meal-plans')} 
                            style={{ 
                                background: 'linear-gradient(135deg, #ff6b4a, #ff8364)', 
                                color: '#fff',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 5px 15px rgba(255, 107, 74, 0.2)'
                            }}
                        >
                            Explore Meal Plans
                        </button>
                    </div>
                ) : (
                    data.map((sub, index) => {
                        const isExpired = sub.status === 'Expired' || sub.status === 'Cancelled';

                        return (
                            <div key={index} className='premium-sub-card'>
                                <div className="sub-card-header">
                                    <div className="sub-icon-box">
                                        <FaCalendarCheck size={28} color="#ff6b4a" /> {/* Brand Orange */}
                                    </div>
                                    <div className="sub-info">
                                        <h3>Monthly Meal Subscription</h3>
                                    </div>
                                    <div className="sub-status">
                                        <span className={`status-pill ${sub.status.toLowerCase()}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="sub-card-body">
                                    <div className="date-info">
                                        <div className="date-item">
                                            <label>Activated On</label>
                                            <p>{new Date(sub.startDate).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' })}</p>
                                        </div>
                                        <div className="date-sep"></div>
                                        <div className="date-item">
                                            <label>Valid Until</label>
                                            <p>{new Date(sub.endDate).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="sub-card-footer">
                                    {isExpired ? (
                                        <button className="renew-btn" onClick={handleRenewPlan}>Renew the Plan</button>
                                    ) : (
                                        <button className="whatsapp-btn" onClick={handleJoinWhatsApp}>
                                            <FaWhatsapp size={20} /> Join WhatsApp
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default MySubscriptions
