import { useContext, useState, useEffect } from "react";
import style from "./navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FiSearch, FiUser, FiShoppingBag, FiPackage, FiMapPin, FiLogOut, FiHome, FiMenu, FiChevronUp, FiChevronDown, FiX, FiTrash2 } from "react-icons/fi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { Items, getTotalCartAmount, token, logOut, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  // Track previous items to detect first add
  const [prevItems, setPrevItems] = useState(0);

  // Animate cart and Auto-Open on first add
  useEffect(() => {
    if (Items > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 500);

      // If items increased from 0 to >0, auto open mini cart
      if (prevItems === 0) {
        setShowMiniCart(true);
      }

      return () => clearTimeout(timer);
    }
    setPrevItems(Items);
  }, [Items]);

  // Close profile on outside click
  useEffect(() => {
    const closeProfile = () => setShowProfile(false);
    document.addEventListener('click', closeProfile);
    return () => document.removeEventListener('click', closeProfile);
  }, []);

  // Highlight active menu based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/profile") setMenu("profile");
    else if (path === "/cart") setMenu("cart");
    else if (path === "/myorders") setMenu("orders");
    else if (path === "/myrewards") setMenu("other"); // Rewards doesn't have a tab
    else if (path === "/myaddresses") setMenu("other");
    else if (path === "/") {
      // If we are on home, we could be on 'home' or 'menu' tab.
      // If the current menu is 'menu' (user clicked it), keep it.
      // Otherwise default to 'home'.
      if (menu !== "menu") {
        setMenu("home");
      }
    }
    else setMenu("other");
  }, [location, menu]); // Added menu dependency to support the check above

  const toggleProfile = (e) => {
    e.stopPropagation();
    setShowProfile(prev => !prev);
  }

  const Logout = () => {
    logOut();
    navigate("/");
  };

  const handleClearCart = (e) => {
    e.stopPropagation();
    if (typeof clearCart === 'function') {
      clearCart();
      setShowMiniCart(false);
    }
  };

  return (
    <>
      <div className={style.Navbar}>
        {/* LOGO */}
        <Link to="/" className={style.logoContainer}>
          <img src={assets.logo} className={style.logo} alt="Restro77" />
        </Link>
        {/* DESKTOP MENU */}
        <ul className={style.navbarMenu}>
          <li onClick={() => { setMenu("home"); navigate('/'); window.scrollTo(0, 0); }} className={menu === "home" ? style.active : ""}>Home</li>
          <li onClick={() => { setMenu("menu"); navigate('/'); setTimeout(() => document.getElementById('ExploreMenu')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={menu === "menu" ? style.active : ""}>Menu</li>
          <li onClick={() => { setMenu("orders"); navigate('/myorders') }} className={menu === "orders" ? style.active : ""}>Orders</li>
          <li onClick={() => { setMenu("contact"); document.getElementById('Footer')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</li>
        </ul>
        {/* RIGHT SECTION */}
        <div className={style.navbarRight} style={{ display: 'flex', gap: '20px' }}>
          {!token ? (
            // If NOT logged in, Show "Sign in" button
            <button onClick={() => setShowLogin(true)} className={style.signInBtn}>Sign in</button>
          ) : (
            <>
              <div className={style.searchIcon} onClick={() => { navigate('/'); setTimeout(() => document.getElementById('search-input')?.focus(), 100); }}>
                <FiSearch />
              </div>
              <div className={style.basketIcon}>
                <Link to='/cart'>
                  <img src={assets.basket_icon} alt="Cart" />
                  {Items > 0 && <div className={style.dot}>{Items}</div>}
                </Link>
              </div>
              <div className={style.navbarProfile} onClick={toggleProfile}>
                {showProfile ? <FiX className={style.profileIconMain} /> : <FiUser className={style.profileIconMain} />}
                {/* Desktop Dropdown */}
                <ul className={`${style.navProfileDropdown} ${showProfile ? style.showDropdown : ""}`}>
                  <li onClick={() => { navigate('/myorders'); setShowProfile(false); }}>
                    <FiPackage className={style.dropIcon} /> <p>Orders</p>
                  </li>
                  <li onClick={() => { navigate('/myrewards'); setShowProfile(false); }}>
                    <BiSolidOffer className={style.dropIcon} /> <p>Rewards</p>
                  </li>
                  <li onClick={() => { navigate('/myaddresses'); setShowProfile(false); }}>
                    <FiMapPin className={style.dropIcon} /> <p>Addresses</p>
                  </li>
                  <li onClick={() => { navigate('/profile'); setShowProfile(false); }}>
                    <FiUser className={style.dropIcon} /> <p>Profile</p>
                  </li>
                  <hr />
                  <li onClick={() => { Logout(); setShowProfile(false); }} className={style.logoutRow}>
                    <FiLogOut className={style.dropIcon} /> <p>Logout</p>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      {/* MOBILE BOTTOM NAVIGATION */}
      <div className={style.bottomNav}>
        <div className={`${style.navItem} ${menu === "home" ? style.activeNav : ""}`} onClick={() => { setMenu("home"); navigate('/'); }}>
          <FiHome />
          <span>Home</span>
        </div>
        <div className={`${style.navItem} ${menu === "menu" ? style.activeNav : ""}`} onClick={() => { setMenu("menu"); navigate('/'); setTimeout(() => document.getElementById('ExploreMenu')?.scrollIntoView(), 100); }}>
          <MdOutlineRestaurantMenu />
          <span>Menu</span>
        </div>
        <div className={`${style.navItemCenter}`}>
          {/* External Chevron Trigger (Only if Items > 0 && Popup Closed) */}
          {!showMiniCart && Items > 0 && (
            <div
              className={style.cartTrigger}
              onClick={(e) => {
                e.stopPropagation();
                setShowMiniCart(true);
              }}
            >
              <FiChevronUp />
            </div>
          )}
          {/* Mini Cart Popup (Reverse Dropdown) */}
          {showMiniCart && Items > 0 && (
            <div className={style.miniCartPopup} onClick={(e) => {
              e.stopPropagation();
              navigate('/cart');
              setShowMiniCart(false);
            }}>
              <div className={style.miniCartHeader}>
                <span>{Items} Items</span>
                <div className={style.miniCartDelete} onClick={handleClearCart}>
                  <FiTrash2 />
                </div>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className={style.miniCartAction}>
                View Cart <FiShoppingBag />
              </div>
              <div className={style.miniCartClose} onClick={(e) => {
                e.stopPropagation();
                setShowMiniCart(false);
              }}>
                <FiChevronDown />
              </div>
            </div>
          )}
          {/* Main Cart Circle */}
          <div
            className={`${style.floatingCart} ${Items > 0 ? style.cartHasItems : style.cartEmpty} ${menu === "cart" ? style.activeCart : ""} ${cartBounce ? style.bounce : ""}`}
            onClick={(e) => {
              if (Items > 0) {
                e.stopPropagation();
                setShowMiniCart(!showMiniCart);
              } else {
                navigate('/cart');
              }
            }}
          >
            <FiShoppingBag className={style.bottomCartIcon} />
            {Items > 0 && <span className={style.floatCount}>{Items}</span>}
          </div>
        </div>
        <div className={`${style.navItem} ${menu === "orders" ? style.activeNav : ""}`} onClick={() => navigate('/myorders')}>
          <FiPackage />
          <span>Orders</span>
        </div>

        {/* PROFILE TAB WITH BOTTOM DROPDOWN */}
        <div className={`${style.navItem} ${menu === "profile" ? style.activeNav : ""}`}
          onClick={(e) => {
            if (!token) {
              setShowLogin(true);
            } else {
              e.stopPropagation();
              toggleProfile(e); // Recycle existing toggle
            }
          }}
        >
          <FiUser />
          <span>Profile</span>

          {/* Bottom Dropdown Menu */}
          {token && (
            <ul className={`${style.bottomProfileDropdown} ${showProfile ? style.showDropdown : ""}`}>
              <li onClick={(e) => { e.stopPropagation(); navigate('/myorders'); setShowProfile(false); }}>
                <FiPackage className={style.dropIcon} /> <p>Orders</p>
              </li>
              <li onClick={(e) => { e.stopPropagation(); navigate('/myrewards'); setShowProfile(false); }}>
                <BiSolidOffer className={style.dropIcon} /> <p>Rewards</p>
              </li>
              <li onClick={(e) => { e.stopPropagation(); navigate('/myaddresses'); setShowProfile(false); }}>
                <FiMapPin className={style.dropIcon} /> <p>Addresses</p>
              </li>
              <li onClick={(e) => { e.stopPropagation(); navigate('/profile'); setShowProfile(false); }}>
                <FiUser className={style.dropIcon} /> <p>Profile</p>
              </li>
              <hr />
              <li onClick={(e) => { e.stopPropagation(); Logout(); setShowProfile(false); }} className={style.logoutRow}>
                <FiLogOut className={style.dropIcon} /> <p>Logout</p>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
