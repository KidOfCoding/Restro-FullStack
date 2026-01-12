import React, { useState, useEffect } from 'react'
import Navbar from './components/Nabar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import BulkUpload from './pages/BulkUpload/BulkUpload'
import Login from './pages/Login/Login'
import Delivery from './pages/Delivery/Delivery'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const URl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} URl={URl} />
      ) : (
        <>
          <Navbar setToken={setToken} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <hr />
          <div className="app-content">
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>}
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            <Routes>
              <Route path='/add' element={<Add URl={URl} />} />
              <Route path='/list' element={<List URl={URl} />} />
              <Route path='/orders' element={<Orders URl={URl} />} />
              <Route path='/delivery' element={<Delivery URl={URl} />} />
              <Route path='/bulk-upload' element={<BulkUpload url={URl} />} />
              <Route path='/' element={<Navigate to="/orders" />} />
            </Routes>
          </div>
        </>
      )
      }
    </div >
  )
}

export default App
