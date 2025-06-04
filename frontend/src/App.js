import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Login from './login/login';
import Signup from './signup/signup';
import SignupOTP from './signup/signup-otp';
import ShowTimeTable from './timetable/view_tt';
import UpdateTimeTable from './timetable/update_tt';
import MarkAttendance from './attendance/mark_attendance';
import ShowRecords from './attendance/attendance_records';
import MarkForFriend from './attendance/mark_for_friend';
import Profile from './profile/profile';

export const Context = React.createContext()

function App() {

  let [isSignedin, setIsSignedin] = useState(false)
  let [username, setUsername] = useState("")

  return (
    <Context.Provider value={[isSignedin, setIsSignedin, username, setUsername]} >
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signup/otp' element={<SignupOTP />} />
          <Route path='/view_time-table' element={<ShowTimeTable />} />
          <Route path='/update_time-table' element={<UpdateTimeTable />} />
          <Route path='/:username/mark_attendance' element={<MarkAttendance />} />
          <Route path='/:username/attendance_records' element={<ShowRecords />} />
          <Route path='/:username/mark_for_friend' element={<MarkForFriend />} />
          <Route path='/:username/profile' element={<Profile />} />
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App;