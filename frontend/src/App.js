import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowTimeTable from './timetable/view_tt';
import UpdateTimeTable from './timetable/update_tt';

export const Context = React.createContext()

function App() {

  let [isSignedin, setIsSignedin] = useState(false)

  return (
    <Context.Provider value={[isSignedin, setIsSignedin]} >
      <Router>
        <Routes>
          <Route path='/view_time-table' element={<ShowTimeTable />} />
          <Route path='/update_time-table' element={<UpdateTimeTable />} />
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App;