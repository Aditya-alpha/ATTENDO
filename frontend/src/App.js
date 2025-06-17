import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Home from './home/home';
import Login from './login/login';
import ForgotPassword from './login/login-fp';
import VerifyOtp from './login/login-vp';
import ChangePassword from './login/login-up';
import Signup from './signup/signup';
import SignupOTP from './signup/signup-otp';
import ShowTimeTable from './timetable/view_tt';
import UpdateTimeTable from './timetable/update_tt';
import MarkAttendance from './attendance/mark_attendance';
import ShowRecords from './attendance/attendance_records';
import MarkForFriend from './attendance/mark_for_friend';
import Profile from './profile/profile';
import UpdatePassword from './profile/profile-up';
import ForgotProfilePassword from './profile/profile-fp';
import VerifyProfileOtp from './profile/profile-vp';
import ChangeProfilePassword from './profile/profile-cp';
import ShowAnalysis from './attendance/attendance_analysis';
import About from './about/about';
import Help from './help/help';
import ProtectedRoute from './protectedRoutes/protectedRoute';

export const Context = React.createContext()

function ScrollToTop() {
  let { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {

  let [username, setUsername] = useState(null)

  useEffect(() => {
    async function handleFetchUsername() {
      try {
        const response = await fetch("http://localhost:8000/get_username", {
          method: "GET",
          credentials: "include"
        })
        if (response.status === 200) {
          let data = await response.json()
          if (data) {
            setUsername(data.username)
          }
        }
      }
      catch (error) {
        alert("An error occurred. Please try again.")
      }
    }
    handleFetchUsername()
  }, [])

  return (
    <Context.Provider value={{ username, setUsername }} >
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/help' element={<Help />} />
          <Route path='/login' element={<Login />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/forgotpassword/verify" element={<VerifyOtp />} />
          <Route path="/login/updatepassword" element={<ChangePassword />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signup/otp' element={<SignupOTP />} />
          <Route path='/:username/view_time_table' element={<ProtectedRoute><ShowTimeTable /></ProtectedRoute>} />
          <Route path='/update_time-table' element={<ProtectedRoute><UpdateTimeTable /></ProtectedRoute>} />
          <Route path='/:username/mark_attendance' element={<ProtectedRoute><MarkAttendance /></ProtectedRoute>} />
          <Route path='/:username/attendance_records' element={<ProtectedRoute><ShowRecords /></ProtectedRoute>} />
          <Route path='/:username/mark_for_friend' element={<ProtectedRoute><MarkForFriend /></ProtectedRoute>} />
          <Route path='/:username/attendance_analysis' element={<ProtectedRoute><ShowAnalysis /></ProtectedRoute>} />
          <Route path='/:username/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/:username/profile/updatepassword' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path='/:username/profile/forgotpassword' element={<ProtectedRoute><ForgotProfilePassword /></ProtectedRoute>} />
          <Route path='/:username/profile/forgotpassword/verify' element={<ProtectedRoute><VerifyProfileOtp /></ProtectedRoute>} />
          <Route path='/:username/profile/changepassword' element={<ProtectedRoute><ChangeProfilePassword /></ProtectedRoute>} />
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App;