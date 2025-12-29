import React from 'react'
import Navbar from './components/Nabar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  // const URl = "https://restro77-backend-rho.vercel.app"
  const URl = "http://localhost:4000"


  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add URl={URl} />} />
          <Route path='/list' element={<List URl={URl} />} />
          <Route path='/orders' element={<Orders URl={URl} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
