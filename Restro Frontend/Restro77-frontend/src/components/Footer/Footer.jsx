import React from 'react'
import style from './footer.module.css'
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  return (
    <div className={style.Footer} id="Footer">
      <div className={style.FooterContent}>
        <div className={style.FooterContentLeft}>
          <img src={assets.logo} alt="" className={style.logo} />
          <p>Experience the best food delivery service with Restro77. Fresh ingredients, authentic flavors, and lightning-fast delivery right to your doorstep. We are committed to satisfying your cravings with our diverse menu.</p>
          <div className={style.FooterSocial}>
            <img src={assets.facebook_icon} alt="" /><img src={assets.twitter_icon} alt="" /><img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className={style.FooterContentMiddle}>
          <h2>
            COMPANY
          </h2>
          <ul>
            <li onClick={() => scrollToSection('root')} style={{ cursor: 'pointer' }}>Home</li>
            <li onClick={() => scrollToSection('ExploreMenu')} style={{ cursor: 'pointer' }}>Menu</li>
            <li><Link to="/cart">Cart</Link></li>
            <li onClick={() => scrollToSection('Footer')} style={{ cursor: 'pointer' }}>Contact Us</li>
          </ul>
        </div>
        <div className={style.FooterContentRight}>
          <h2>Get In Touch</h2>
          <ul>
            <li>+91 7008939551</li>
            <li>Restro77@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        CopyRight 2024 ©️ Company.com - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer