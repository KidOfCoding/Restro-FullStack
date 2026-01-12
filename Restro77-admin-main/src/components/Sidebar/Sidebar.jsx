import React from 'react'
import './SideBar.css'
import { NavLink } from 'react-router-dom'
import { FaPlus, FaList, FaTruck, FaCloudUploadAlt } from 'react-icons/fa'
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`Sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option" onClick={closeSidebar}>
          <FaPlus />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option" onClick={closeSidebar}>
          <FaList />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option" onClick={closeSidebar}>
          <MdOutlinePlaylistAddCheck />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/bulk-upload' className="sidebar-option" onClick={closeSidebar}>
          <FaCloudUploadAlt />
          <p>Bulk Upload</p>
        </NavLink>
        <NavLink to='/delivery' className="sidebar-option" onClick={closeSidebar}>
          <FaTruck />
          <p>Delivery</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
