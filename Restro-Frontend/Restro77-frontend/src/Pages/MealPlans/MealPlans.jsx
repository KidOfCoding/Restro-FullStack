import React, { useContext, useEffect, useState } from 'react'
import './MealPlans.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GiFastNoodles } from 'react-icons/gi'

import monthlyImg from '../../assets/monthly_plan.png'
import weeklyImg from '../../assets/weekly_plan.png'

const MealPlans = () => {
    const { token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("monthly");
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);

    // Weekly Form State
    const [mealType, setMealType] = useState("Veg"); // Veg or Nonveg
    const [hasLunch, setHasLunch] = useState(false);
    const [hasDinner, setHasDinner] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const calculateBreakdown = () => {
        let lunchPrice = 0;
        let dinnerPrice = 0;

        if (hasLunch) {
            lunchPrice = mealType === "Veg" ? 530 : 560; // 520+10, 550+10
        }
        if (hasDinner) {
            dinnerPrice = 560; // 550+10
        }

        return {
            lunchPrice,
            dinnerPrice,
            total: lunchPrice + dinnerPrice
        }
    };

    const handleSubscribe = () => {
        if (!token) {
            toast.error("Please login to subscribe!");
            return;
        }

        if (activeTab === "monthly") {
            navigate('/subscription-checkout', {
                state: { customPlan: { name: "Monthly Subscription", price: 3500, planType: "Monthly" } }
            });
        } else {
            const breakdown = calculateBreakdown();
            if (breakdown.total === 0) {
                toast.error("Please select at least Lunch or Dinner!");
                return;
            }

            let planName = `Weekly ${mealType}`;
            if (hasLunch && hasDinner) planName += " (Lunch + Dinner)";
            else if (hasLunch) planName += " (Lunch)";
            else if (hasDinner) planName += " (Dinner)";

            navigate('/subscription-checkout', {
                state: { customPlan: { name: planName, price: breakdown.total, planType: "Weekly" } }
            });
        }
    }

    const { lunchPrice, dinnerPrice, total } = calculateBreakdown();

    return (
        <div className='meal-plans-premium-wrapper'>
            <div className="meal-plans-hero">
                <h1>Choose Your Perfect Meal Plan</h1>
                <p>Flexible, delicious, home-style meals delivered fresh to corporate employees and students.</p>
            </div>

            <div className="meal-plans-layout">
                {/* Left Side: Dynamic Image */}
                <div className="meal-image-container" onClick={() => setIsImageFullscreen(true)}>
                    <img
                        src={activeTab === "monthly" ? monthlyImg : weeklyImg}
                        alt={`${activeTab} plan details`}
                        className="premium-details-img cursor-zoom-in"
                    />
                    <div className="click-to-enlarge">🔍 Tap to enlarge</div>
                </div>

                {/* Right Side: Interaction Panel */}
                <div className="meal-interaction-panel">

                    {/* Animated Tab Switcher */}
                    <div className="premium-tab-switcher">
                        <div
                            className={`tab-bg ${activeTab === 'monthly' ? 'left' : 'right'}`}
                        ></div>
                        <button
                            className={`p-tab ${activeTab === 'monthly' ? 'active' : ''}`}
                            onClick={() => setActiveTab('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`p-tab ${activeTab === 'weekly' ? 'active' : ''}`}
                            onClick={() => setActiveTab('weekly')}
                        >
                            Weekly
                        </button>
                    </div>

                    <div className="interaction-content">
                        {activeTab === "monthly" ? (
                            <div className="premium-monthly">
                                <div className="monthly-info-box">
                                    <div className="info-icon-wrapper">
                                        <GiFastNoodles size={80} color="#ff6b4a" />
                                    </div>
                                    <p>You can order any <b>Fried Rice</b> or <b>Noodles</b> in place of meal just that much.</p>
                                </div>
                                <div className="monthly-spacer"></div>

                                <button className="glow-subscribe-btn" onClick={handleSubscribe}>
                                    Subscribe Now - ₹3500
                                </button>
                            </div>
                        ) : (
                            <div className="premium-weekly">
                                <div className="config-group">
                                    <h4>Step 1: Choose Diet</h4>
                                    <div className="diet-cards">
                                        <div
                                            className={`diet-card ${mealType === 'Veg' ? 'active' : ''}`}
                                            onClick={() => setMealType('Veg')}
                                        >
                                            <span className="emoji">🌱</span> <span>Veg</span>
                                        </div>
                                        <div
                                            className={`diet-card ${mealType === 'Nonveg' ? 'active' : ''}`}
                                            onClick={() => setMealType('Nonveg')}
                                        >
                                            <span className="emoji">🍗</span> <span>Non-Veg</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="config-group">
                                    <h4>Step 2: Choose Meals</h4>
                                    <div className="meal-toggle-boxes">
                                        <div
                                            className={`meal-box ${hasLunch ? 'selected' : ''}`}
                                            onClick={() => setHasLunch(!hasLunch)}
                                        >
                                            <div className="meal-header">
                                                <span className="meal-title">☀️ Lunch</span>
                                                <div className="checkbox-ring">
                                                    <div className="checkbox-dot"></div>
                                                </div>
                                            </div>
                                            <span className="meal-price-badge">₹{mealType === 'Veg' ? '530' : '560'}</span>
                                        </div>

                                        <div
                                            className={`meal-box ${hasDinner ? 'selected' : ''}`}
                                            onClick={() => setHasDinner(!hasDinner)}
                                        >
                                            <div className="meal-header">
                                                <span className="meal-title">🌙 Dinner</span>
                                                <div className="checkbox-ring">
                                                    <div className="checkbox-dot"></div>
                                                </div>
                                            </div>
                                            <span className="meal-price-badge">₹560</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="receipt-box">
                                    <div className="receipt-row">
                                        <span>Plan</span>
                                        <span>Weekly ({mealType})</span>
                                    </div>
                                    {hasLunch && (
                                        <div className="receipt-row">
                                            <span>Included: Lunch</span>
                                            <span>₹{lunchPrice}</span>
                                        </div>
                                    )}
                                    {hasDinner && (
                                        <div className="receipt-row">
                                            <span>Included: Dinner</span>
                                            <span>₹{dinnerPrice}</span>
                                        </div>
                                    )}
                                    {!hasLunch && !hasDinner && (
                                        <div className="receipt-empty">
                                            Please select Lunch or Dinner
                                        </div>
                                    )}
                                    <div className="receipt-divider"></div>
                                    <div className="receipt-total">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>

                                <button
                                    className={`glow-subscribe-btn ${total === 0 ? 'disabled' : ''}`}
                                    onClick={handleSubscribe}
                                >
                                    {total > 0 ? `Subscribe Now - ₹${total}` : 'Select Meals Above'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {isImageFullscreen && (
                <div className="fullscreen-image-overlay" onClick={() => setIsImageFullscreen(false)}>
                    <button className="close-fullscreen-btn" onClick={() => setIsImageFullscreen(false)}>×</button>
                    <img
                        src={activeTab === "monthly" ? monthlyImg : weeklyImg}
                        alt="fullscreen plan details"
                        className="fullscreen-image"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image itself
                    />
                </div>
            )}
        </div>
    )
}

export default MealPlans
