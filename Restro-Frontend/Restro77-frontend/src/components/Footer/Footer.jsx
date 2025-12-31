import React from 'react'
import style from './footer.module.css'
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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
          <p>
            Experience the best food delivery service with Restro77. Fresh ingredients, authentic flavors, and lightning-fast delivery right to your doorstep.
            <br />
            <Link to="/about" className={style.aboutLink} onClick={() => window.scrollTo(0, 0)}>
              Know more about us ↗
            </Link>
          </p>
          <div className={style.FooterSocial}>
            <div className={style.socialIcon}><FaFacebookF /></div>
            <div className={style.socialIcon}><FaInstagram /></div>
            <div className={style.socialIcon}><FaLinkedinIn /></div>
          </div>
        </div>
        <div className={style.FooterContentMiddle}>
          <h2>COMPANY</h2>
          <ul>
            <li onClick={() => scrollToSection('root')} style={{ cursor: 'pointer' }}>Home</li>
            <li onClick={() => scrollToSection('ExploreMenu')} style={{ cursor: 'pointer' }}>Menu</li>
            <li onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</li>
            <li onClick={() => scrollToSection('Footer')} style={{ cursor: 'pointer' }}>Contact Us</li>
          </ul>
        </div>
        <div className={style.FooterContentRight}>
          <h2>Contact & Location</h2>
          <ul>
            <li>Restro77</li>
            <li>In front of CGU Backgate</li>
            <li>Mahura, Bhubaneswar – 752054</li>
            <li>Odisha, India</li>
            <li>📞 7008939551</li>
            <li>📧 restro77bbsr@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        CopyRight 2024 ©️ restro77.com -  Created with ❤️by Debasish Dash.
      </p>
    </div>
  );
}

export default Footer