import React, { useState, useEffect } from 'react';
import './SpecialOfferModal.css';
import { FaRupeeSign } from "react-icons/fa";

const SpecialOfferModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check session storage so it shows once per session
        const hasSeen = sessionStorage.getItem('hasSeenPromo_v2');
        if (!hasSeen) {
            // Add a small delay for smoother entrance on page load
            const timer = setTimeout(() => {
                setIsVisible(true);
                sessionStorage.setItem('hasSeenPromo_v2', 'true');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="offer-overlay">
            <div className="offer-modal">
                <button className="close-btn" onClick={() => setIsVisible(false)}>&times;</button>
                <div className="confetti-bg"></div>

                <div className="offer-content">
                    <h2>🎉 Special Delivery Offers!</h2>
                    <p>Save big on delivery charges with our new offers!</p>

                    <div className="offer-features">
                        <div className="feature-item">
                            <div className="feature-icon">⚡</div>
                            <div className="feature-text">
                                <h3>Happy Hour (9 PM - 10 PM)</h3>
                                <p>Select <b>9-10 PM</b> slot for <b>FREE Delivery</b> at any Landmark (up to 5km)!</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">📍</div>
                            <div className="feature-text">
                                <h3>Free Delivery above <FaRupeeSign />149</h3>
                                <p>Get <b>FREE Delivery</b> at landmarks on orders above <b><FaRupeeSign />149</b> (up to 5km)!</p>
                            </div>
                        </div>
                    </div>

                    <button className="offer-cta" onClick={() => setIsVisible(false)}>
                        Start Ordering 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpecialOfferModal;
