import React from 'react';
import style from './portfoliobutton.module.css';

const PortfolioButton = () => {
    const handleNavigation = () => {
        // Replace this URL with your actual portfolio URL
        window.open('http://www.linkedin.com/in/debasish-dash-276638310', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={style.container} onClick={handleNavigation} title="Visit My Portfolio">
            <div className={style.outerRing}></div>
            <div className={style.innerCircle}>
                <span className={style.logoText}>D</span>
            </div>
        </div>
    );
};

export default PortfolioButton;
