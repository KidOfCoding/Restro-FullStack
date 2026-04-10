import React, { useContext, useEffect, useState } from 'react'
import './MySubscriptions.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { FaCalendarCheck, FaWhatsapp, FaTrash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MySubscriptions = () => {
    const { URl, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('Active');
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

    const handleDelete = (subscriptionId) => {
        const toastId = toast.warn(
            <div style={{ textAlign: 'center', padding: '5px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Confirm Cancellation</h3>
                <p style={{ marginBottom: '20px', fontSize: '14px', color: 'inherit' }}>Are you sure you want to stop this subscription? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                        onClick={async () => {
                            toast.dismiss(toastId);
                            try {
                                const response = await axios.post(URl + "/api/mealplan/cancel", { subscriptionId }, { headers: { token } });
                                if (response.data.success) {
                                    toast.success("Subscription stopped.");
                                    fetchSubs();
                                } else {
                                    toast.error(response.data.message);
                                }
                            } catch (e) {
                                toast.error("Error cancelling subscription");
                            }
                        }}
                        style={{ padding: '8px 16px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                    >
                        Confirm Stop
                    </button>
                    <button 
                        onClick={() => toast.dismiss(toastId)}
                        style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'transparent', color: 'inherit', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
        );
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
                <h2>My Subscriptions</h2>
                <p>Manage your ongoing and past meal plans</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px', maxWidth: '400px', margin: '0 auto 30px' }}>
                <button 
                    onClick={() => setActiveTab('Active')} 
                    style={{ background: 'transparent', color: activeTab === 'Active' ? '#ff6b4a' : '#fff', border: 'none', borderBottom: activeTab === 'Active' ? '2px solid #ff6b4a' : 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', padding: '5px 15px', transition: '0.3s' }}
                >
                    Active
                </button>
                <button 
                    onClick={() => setActiveTab('Expired')} 
                    style={{ background: 'transparent', color: activeTab === 'Expired' ? '#ff6b4a' : '#fff', border: 'none', borderBottom: activeTab === 'Expired' ? '2px solid #ff6b4a' : 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', padding: '5px 15px', transition: '0.3s' }}
                >
                    Expired
                </button>
            </div>

            <div className="my-sub-container">
                {data.filter(sub => activeTab === 'Active' ? sub.status === 'Active' || sub.status === 'Pending' : sub.status === 'Expired' || sub.status === 'Cancelled').length === 0 ? (
                    <div className="no-subs">
                        <img src={assets.parcel_icon} alt="No subscriptions"/>
                        <p>You have no {activeTab.toLowerCase()} subscriptions.</p>
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
                    data.filter(sub => activeTab === 'Active' ? sub.status === 'Active' || sub.status === 'Pending' : sub.status === 'Expired' || sub.status === 'Cancelled').map((sub, index) => {
                        const isExpired = sub.status === 'Expired' || sub.status === 'Cancelled';

                        return (
                            <div key={index} className='premium-sub-card' style={{ position: 'relative' }}>
                                {!isExpired && (
                                    <button 
                                        className="delete-sub-btn" 
                                        onClick={() => handleDelete(sub._id)}
                                        style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}
                                        title="Stop Subscription"
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                )}
                                <div className="sub-card-header">
                                    <div className="sub-icon-box">
                                        <FaCalendarCheck size={28} color="#ff6b4a" /> {/* Brand Orange */}
                                    </div>
                                    <div className="sub-info">
                                        <h3>Monthly Meal Subscription</h3>
                                    </div>
                                    <div className="sub-status" style={!isExpired ? { marginRight: '35px' } : {}}>
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
                                
                                <div className="sub-card-footer" style={{ width: '100%' }}>
                                    {isExpired ? (
                                        <button className="renew-btn" onClick={handleRenewPlan} style={{ width: '100%' }}>Renew the Plan</button>
                                    ) : (
                                        <button className="whatsapp-btn" onClick={handleJoinWhatsApp} style={{ width: '100%' }}>
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
