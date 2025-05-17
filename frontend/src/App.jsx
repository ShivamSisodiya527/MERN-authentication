import React, { useContext, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import EmailVerify from './Pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext';
const App = () => {
  const { getUserData } = useContext(AppContent);
  useEffect(() => {
    getUserData();
  }, [])
  return (
    <div >
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App
