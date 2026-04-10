import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionPromoBanner.css';

const SubscriptionPromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="sub-promo-wrapper">
      <div className="sub-promo-container" onClick={() => {
          navigate('/meal-plans');
          window.scrollTo(0, 0);
      }}>
        
        {/* The Golden Diagonal Ribbon */}
        <div className="sub-promo-ribbon">
            <span>15% OFF</span>
        </div>

        {/* Calendar Icon SVG */}
        <div className="sub-promo-icon-container">
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Calendar Body */}
            <rect x="8" y="14" width="48" height="42" rx="4" fill="#F8F9FA" stroke="#222" strokeWidth="2.5"/>
            
            {/* Red Top Header */}
            <rect x="8" y="14" width="48" height="14" rx="4" fill="#f73809" stroke="#222" strokeWidth="2.5" />
            <path d="M8 28H56" stroke="#222" strokeWidth="2.5"/>

            {/* Rings */}
            <path d="M18 8V18" stroke="#222" strokeWidth="3" strokeLinecap="round"/>
            <path d="M46 8V18" stroke="#222" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="2.5" fill="#fff" />
            <circle cx="46" cy="18" r="2.5" fill="#fff" />

            {/* Fork */}
            <path d="M22 34V41C22 42.5 23 44 25 44V51" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 34V41C28 42.5 27 44 25 44" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25 34V42" stroke="#222" strokeWidth="2" strokeLinecap="round"/>

            {/* Knife */}
            <path d="M38 34V51" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            <path d="M38 34C34 34 34 39 34 42H38" fill="#222"/>

            {/* Bottom Right Check/Cross Box */}
            <rect x="42" y="44" width="10" height="10" fill="#fff" stroke="#222" strokeWidth="2"/>
            <path d="M44 46L50 52" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
            <path d="M50 46L44 52" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Content */}
        <div className="sub-promo-content">
          <h3 className="sub-promo-title">Monthly/Weekly Meal Subscription</h3>
          <button className="sub-promo-btn" onClick={(e) => {
              e.stopPropagation();
              navigate('/meal-plans');
              window.scrollTo(0, 0);
          }}>
            View Plans
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SubscriptionPromoBanner;
