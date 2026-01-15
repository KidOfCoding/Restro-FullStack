import React, { useState, useEffect } from 'react';
import './SpecialOfferModal.css';
import { FaRupeeSign } from "react-icons/fa";

const SpecialOfferModal = ({ show, onClose }) => {

    if (!show) return null;

    return (
        <div className="offer-overlay">
            <div className="offer-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
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
                            <div className="feature-icon">♨️</div>
                            <div className="feature-text">
                                <h3>Free Delivery above <span style={{ whiteSpace: 'nowrap' }}><FaRupeeSign />149</span></h3>
                                <p>Get <b>FREE Delivery</b> at landmarks on orders above <b><span style={{ whiteSpace: 'nowrap' }}><FaRupeeSign />149</span></b> (up to 5km)!</p>
                            </div>
                        </div>
                    </div>

                    <button className="offer-cta" onClick={onClose}>
                        Start Ordering 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpecialOfferModal;
