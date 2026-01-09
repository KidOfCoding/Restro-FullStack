import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
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

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
      <ScrollToTop />
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
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