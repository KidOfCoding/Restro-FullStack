import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/Login/LoginPopUp'
import Verify from './Pages/Verify/Verify'
import MyOrders from './Pages/Orders/MyOrders'
import MyRewards from './Pages/MyRewards/MyRewards'
import MyAddresses from './Pages/MyAddresses/MyAddresses'
import Profile from './Pages/Profile/Profile'
import About from './Pages/About/About'
import FloatingCart from './components/FloatingCart/FloatingCart'
import PortfolioButton from './components/PortfolioButton/PortfolioButton'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import SpecialOfferModal from './components/SpecialOfferModal/SpecialOfferModal'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false);
  const location = useLocation();

  // Auto-Open Offer Modal logic
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenPromo_v3');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowOfferModal(true);
        sessionStorage.setItem('hasSeenPromo_v3', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <SpecialOfferModal show={showOfferModal} onClose={() => setShowOfferModal(false)} />
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home setShowOfferModal={setShowOfferModal} showOfferModal={showOfferModal} />} />
          <Route path="/cart" element={<Cart setShowLogin={setShowLogin} />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/myrewards" element={<MyRewards />} />
          <Route path="/myaddresses" element={<MyAddresses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <FloatingCart />
        <PortfolioButton />
      </div>
      <Footer />
    </>
  );
}

export default App