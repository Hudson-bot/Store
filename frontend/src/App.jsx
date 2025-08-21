import './App.css'
import StoreDashboard from './components/Admin/StoreDashboard'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomerDashboard from './components/Customer/CustomerDashboard'
import AdminDashboard from './components/Store-Admin/AdminDashboard'
import UpdatePassword from './components/UpdatePassword'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/store-dashboard" element={<StoreDashboard/>} />
        <Route path="/customer-dashboard" element={<CustomerDashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/update-password" element={<UpdatePassword />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
