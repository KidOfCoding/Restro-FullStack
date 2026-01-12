import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { FaList } from 'react-icons/fa'

const Navbar = ({ setToken, toggleSidebar }) => {
  return (
    <div className='Navbar'>
      <div className="nav-left">
        <FaList className="sidebar-toggle" onClick={toggleSidebar} />
        <img className='logo' src={assets.logo} alt="" />
      </div>
      <div className='right-nav'>
        <button onClick={() => setToken("")} className='logout-btn'>Logout</button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar
