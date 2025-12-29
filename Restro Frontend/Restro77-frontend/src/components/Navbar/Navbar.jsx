import { useContext, useState } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { TbH1 } from "react-icons/tb";

const Navbar = ({ setShowLogin }) => {
  // useState used here for menu
  const [menu, setMenu] = useState("home");

  const { Items, getTotalCartAmount, token, logOut } = useContext(StoreContext)

  const navigate = useNavigate()
  const Logout = () => {
    logOut();
    navigate("/")
  }

  return (
    <div className={style.Navbar}>
      <div>
        <Link to="/"><img src={assets.logo} className={style.logo} /></Link>

      </div>
      <ul className={style.navbarMenu}>
        <li
          onClick={() => {
            setMenu("home");
            navigate('/');
            window.scrollTo(0, 0);
          }}
          className={menu === "home" ? style.active : ""}
          style={{ cursor: 'pointer' }}
        >
          home
        </li>
        <li
          onClick={() => {
            setMenu("menu");
            navigate('/');
            setTimeout(() => {
              const elem = document.getElementById('ExploreMenu');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className={menu === "menu" ? style.active : ""}
          style={{ cursor: 'pointer' }}
        >
          menu
        </li>
        <li
          onClick={() => {
            setMenu("cart");
            navigate('/cart');
          }}
          className={menu === "cart" ? style.active : ""}
          style={{ cursor: 'pointer' }}
        >
          cart
        </li>
        <li
          onClick={() => {
            setMenu("rewards");
            navigate('/myrewards');
          }}
          className={menu === "rewards" ? style.active : ""}
          style={{ cursor: 'pointer' }}
        >
          rewards
        </li>
        <li
          onClick={() => {
            setMenu("contact-us");
            const elem = document.getElementById('Footer');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className={menu === "contact-us" ? style.active : ""}
          style={{ cursor: 'pointer' }}
        >
          contact us
        </li>
      </ul>
      <div className={style.navbarRight}>
        <img src={assets.search_icon} alt="" onClick={() => {
          navigate('/');
          setTimeout(() => {
            const element = document.getElementById('fooddisplay');
            const input = document.getElementById('search-input');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
            if (input) {
              input.focus();
            }
          }, 100)
        }} className={style.searchTrigger} style={{ cursor: 'pointer' }} />
        <div className={style.searchIcon}>
          <Link to='/cart'>
            <img src={assets.basket_icon} />
            {Items > 0 && (
              <div className={style.dot}>{Items}</div>
            )}
          </Link>

        </div>
      </div>
      {!token ? <button
        onClick={() => {
          setShowLogin(true);
        }}
      >
        Sign in
      </button> : <div className={style.navbarProfile}>
        <img src={assets.profile_icon} />
        <ul className={style.navProfileDropdown}>
          <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} /><p>Orders</p></li>
          <li onClick={() => navigate('/myrewards')}><img src={assets.bag_icon} /><p>Rewards</p></li>
          <li onClick={() => navigate('/myaddresses')}><img src={assets.profile_icon} /><p>Addresses</p></li>
          <li onClick={() => navigate('/profile')}><img src={assets.profile_icon} /><p>Profile</p></li>
          <hr />
          <li onClick={Logout}><img src={assets.logout_icon} /><p>Logout</p></li>
        </ul>
      </div>}

      {/* Mobile Menu Icon */}
      <div className={style.hamburger} onClick={() => setMenu(prev => prev === "mobile-open" ? "home" : "mobile-open")}>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
      </div>

      {/* Mobile Menu Overlay */}
      {
        menu === "mobile-open" && (
          <ul className={style.mobileMenu}>
            <li onClick={() => { navigate('/'); setMenu("home"); }}>Home</li>
            <li onClick={() => { navigate('/'); setMenu("menu"); setTimeout(() => document.getElementById('ExploreMenu')?.scrollIntoView(), 100) }}>Menu</li>
            <li onClick={() => { navigate('/cart'); setMenu("cart"); }}>Cart</li>
            <li onClick={() => { navigate('/myrewards'); setMenu("rewards"); }}>Rewards</li>
            <li onClick={() => { const elem = document.getElementById('Footer'); if (elem) elem.scrollIntoView(); setMenu("contact"); }}>Contact</li>
          </ul>
        )
      }
    </div >
  );
};

export default Navbar;
