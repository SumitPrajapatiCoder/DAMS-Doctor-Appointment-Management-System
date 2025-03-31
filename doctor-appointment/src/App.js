import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css';
import Home_page from './pages/Home_page';
import Login from './pages/Login';
import Register from './pages/Register';
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectRoute from './components/ProtectRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Users from './pages/Admin/Users';
import Doctors from './pages/Admin/Doctors';
import Profile from './pages/Doctor/Profile';
import BookingPage from './pages/BookingPage';
import AppointmentList from './pages/AppointmentList';
import DoctorAppointmentList from './pages/Doctor/DoctorAppointmentList';

function App() {
  const { loading } = useSelector((state) => state.alert);
  return (
    <>
     {/* This For Pop-up Message */}
    <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
              
              <Route path="/apply_doctor" element={
                  <ProtectRoute>
                    <ApplyDoctor />
                  </ProtectRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectRoute>
                 <Users/>
                </ProtectRoute>
              } />
              <Route path="/admin/doctors" element={
                <ProtectRoute>
                  <Doctors/>
                </ProtectRoute>
              } />
              <Route path="/doctor/profile/:id" element={
                <ProtectRoute>
                  <Profile />
                </ProtectRoute>
              } />
              <Route path="/doctor/book-appointment/:doctorId" element={
                <ProtectRoute>
                  <BookingPage/>
                </ProtectRoute>
              } />
              <Route path="/notification" element={
                <ProtectRoute>
                  <Notification/>
                </ProtectRoute>
              } />
            <Route path="/Login" element={
              <PublicRoute>
                  <Login />
              </PublicRoute>
              } />
            <Route path="/Register" element={
              <PublicRoute>
                  <Register />
              </PublicRoute>
              } />
              <Route path="/appointment" element={
                <ProtectRoute>
                  <AppointmentList />
                </ProtectRoute>
              } />
              <Route path="/doctor_appointment" element={
                <ProtectRoute>
                  <DoctorAppointmentList />
                </ProtectRoute>
              } />
              <Route path="/" element={
                <ProtectRoute>
                  <Home_page />
                </ProtectRoute>
              } />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
