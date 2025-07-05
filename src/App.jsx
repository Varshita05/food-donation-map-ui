import { useState } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import DonationPage from './DonationPage'
import VolunteerDashboard from './VolunteerDashboard'
import IndustryDonorAnalytics from './IndustryDonorAnalytics'
import MonthlyList from './MonthlyList'
// import AdminDashboard from './AdminDashboard'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
      </Routes>
    </div>
  )
}

export default App
