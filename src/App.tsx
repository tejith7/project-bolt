import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { RideProvider } from './context/RideContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import BookRide from './pages/BookRide';
import RideTracking from './pages/RideTracking';
import RideHistory from './pages/RideHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <UserProvider>
        <RideProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="rider/dashboard" element={<RiderDashboard />} />
              <Route path="driver/dashboard" element={<DriverDashboard />} />
              <Route path="book" element={<BookRide />} />
              <Route path="ride/:rideId" element={<RideTracking />} />
              <Route path="history" element={<RideHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </RideProvider>
      </UserProvider>
    </Router>
  );
}

export default App;