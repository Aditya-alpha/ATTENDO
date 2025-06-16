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
import VerifyProfileOtp from './profile/profile-vp'
import ChangeProfilePassword from './profile/profile-cp';
import ShowAnalysis from './attendance/attendance_analysis';
import About from './about/about';
import Help from './help/help';

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
          <Route path='/:username/view_time_table' element={<ShowTimeTable />} />
          <Route path='/update_time-table' element={<UpdateTimeTable />} />
          <Route path='/:username/mark_attendance' element={<MarkAttendance />} />
          <Route path='/:username/attendance_records' element={<ShowRecords />} />
          <Route path='/:username/mark_for_friend' element={<MarkForFriend />} />
          <Route path='/:username/attendance_analysis' element={<ShowAnalysis />} />
          <Route path='/:username/profile' element={<Profile />} />
          <Route path='/:username/profile/updatepassword' element={<UpdatePassword />} />
          <Route path='/:username/profile/forgotpassword' element={<ForgotProfilePassword />} />
          <Route path='/:username/profile/forgotpassword/verify' element={<VerifyProfileOtp />} />
          <Route path='/:username/profile/changepassword' element={<ChangeProfilePassword />} />
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App;