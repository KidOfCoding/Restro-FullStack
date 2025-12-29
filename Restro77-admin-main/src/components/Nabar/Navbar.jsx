import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='Navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='right-nav'>
        <button onClick={() => setToken("")} className='logout-btn'>Logout</button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar
