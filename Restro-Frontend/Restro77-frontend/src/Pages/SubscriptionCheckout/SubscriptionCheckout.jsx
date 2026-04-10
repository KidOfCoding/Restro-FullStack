import React, { useContext, useEffect, useState } from 'react'
import './SubscriptionCheckout.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const SubscriptionCheckout = () => {
    const { URl, token, userData } = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();
    const customPlan = location.state?.customPlan;

    const [data, setData] = useState({
        name: "",
        phone: "",
        address: ""
    })
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!customPlan) {
            navigate('/meal-plans');
        }
        if (!token) {
            navigate('/cart'); // standard fallback
        }

        if (userData && !data.name && !data.phone && !data.address) {
            const defaultAddress = userData.address || (userData.addresses && userData.addresses.length > 0 ? userData.addresses[0].address : "");
            setData({
                name: userData.name || "",
                phone: userData.phone || "",
                address: defaultAddress
            });
        }
    }, [customPlan, token, navigate, userData])

    const hasCompleteProfile = userData?.name && userData?.phone && (userData?.address || userData?.addresses?.length > 0);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: order.key,
            amount: order.order.amount,
            currency: order.order.currency,
            name: "Restro77 Meal Plan",
            description: "Subscription Payment",
            order_id: order.order.id,
            receipt: order.order.receipt,
            handler: async (response) => {
                try {
                    const verifyRes = await axios.post(URl + "/api/mealplan/verify", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        subscriptionId: order.subscriptionId
                    }, { headers: { token } });

                    if (verifyRes.data.success) {
                        toast.success("Subscription Activated!");

                        // WhatsApp Generation
                        const msgText = `Hi! I just subscribed to the Meal Plan!
*Plan:* ${customPlan.name}
*Amount Paid:* ₹${customPlan.price}
*Payment ID:* ${response.razorpay_payment_id}

*My Details:*
Name: ${data.name}
Phone: ${data.phone}
Address: ${data.address}`;

                        const whatsappUrl = `https://wa.me/917008939551?text=${encodeURIComponent(msgText)}`;
                        window.open(whatsappUrl, '_blank');

                        navigate("/my-subscriptions", { state: { fromPayment: true } });
                    } else {
                        navigate("/my-subscriptions"); // it'll show failed/pending
                        toast.error(verifyRes.data.message);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Payment Verification Error");
                }
            },
            theme: {
                color: "#f73809"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const placeSubscription = async (event) => {
        event.preventDefault();

        // Phone Validation (Exact 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            const userId = "will-be-fetched-from-token"; // The backend auth middleware gives req.body.userId from token!
            const subData = {
                customPlan,
                address: data
            }

            const response = await axios.post(URl + "/api/mealplan/subscribe", subData, { headers: { token } });

            if (response.data.success) {
                initPay(response.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error initiating subscription");
        }
    }

    const handleBossBypass = async () => {
        // Validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            const subData = {
                customPlan,
                address: data
            }

            const response = await axios.post(URl + "/api/mealplan/boss-bypass", subData, { headers: { token } });

            if (response.data.success) {
                toast.success("Boss Plan Activated!");
                
                // WhatsApp Generation
                const msgText = `Hi! I just activated my Meal Plan!
*Plan:* ${customPlan.name}
*Amount:* ₹0

*My Details:*
Name: ${data.name}
Phone: ${data.phone}
Address: ${data.address}`;

                const whatsappUrl = `https://wa.me/917008939551?text=${encodeURIComponent(msgText)}`;
                window.open(whatsappUrl, '_blank');

                navigate("/my-subscriptions", { state: { fromPayment: true } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error bypassing payment");
        }
    }

    if (!customPlan) return null;

    return (
        <form onSubmit={placeSubscription} className='sub-place-order'>
            <div className="sub-checkout-container">
                <div className="checkout-header-flex">
                    <p className="sub-title">Subscriber Details</p>
                    {hasCompleteProfile && !isEditing && (
                        <button type="button" className="edit-details-btn" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </div>

                {hasCompleteProfile && !isEditing ? (
                    <div className="saved-address-view">
                        <div className="saved-address-header">
                            <span className="saved-badge">✓ Profile Details Applied</span>
                        </div>
                        <p className="saved-name-phone"><strong>{data.name}</strong> • {data.phone}</p>
                        <p className="saved-address-text">{data.address}</p>
                        <p className="saved-info-note">We will use your default profile details for this subscription.</p>
                    </div>
                ) : (
                    <div className="form-inputs-view">
                        <input required name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Full Name' />
                        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='10 Digit Phone Number' maxLength={10} minLength={10} />
                        <textarea required name='address' onChange={onChangeHandler} value={data.address} placeholder='Complete Delivery Address' rows={5}></textarea>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type='submit' className="checkout-pay-btn" style={{ flex: 1.5 }}>
                        Proceed to Payment
                    </button>
                    {userData?.phone === '8596962616' && (
                        <button 
                            type='button' 
                            className="checkout-pay-btn" 
                            onClick={handleBossBypass}
                            style={{ flex: 1, background: '#111', color: '#eded05', border: '1px solid #eded05' }}
                            title="Skip payment natively for Boss Account"
                        >
                            Boss Checkout
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
}

export default SubscriptionCheckout
