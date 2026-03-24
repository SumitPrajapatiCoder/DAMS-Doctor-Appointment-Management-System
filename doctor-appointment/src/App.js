import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css';
import Home_page from './pages/Home_page';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectRoute from './components/ProtectRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/Doctor/ApplyDoctor';
import ApplyPatient from './pages/Patients/ApplyPatient';
import Notification from './pages/Notification';
import Users from './pages/Admin/Users';
import Doctors from './pages/Admin/Doctors';
import Profile from './pages/Doctor/Profile';
import PatientProfile from './pages/Patients/PatientProfile';
import BookingPage from './pages/BookingPage';
import AppointmentList from './pages/Patients/AppointmentList'
import RecommendedDoctors from './pages/Patients/RecommendedDoctors';
import DoctorAppointmentList from './pages/Doctor/DoctorAppointmentList' ;
import Patients from './pages/Admin/Patients';
import UserPayment from './pages/Patients/UserPayment';
import Receipt from './pages/Receipt';



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
        <Route path="/apply_patient" element={
                  <ProtectRoute>
                    <ApplyPatient />
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

              <Route path="/user/payment/:appointmentId" element={
                <ProtectRoute>
                  <UserPayment />
                </ProtectRoute>
              } />

              <Route path="/receipt/:transactionId" element={
                <ProtectRoute>
                  <Receipt />
                </ProtectRoute>
              } />

             

              <Route path="/admin/Patients" element={
                <ProtectRoute>
                  <Patients />
                </ProtectRoute>
              } />


              <Route path="/doctor/profile/:id" element={
                <ProtectRoute>
                  <Profile />
                </ProtectRoute>
              } />
              <Route path="/patient/profile/:id" element={
                <ProtectRoute>
                  <PatientProfile />
                </ProtectRoute>
              } />

              <Route path="/user/recommended-doctors" element={
                <ProtectRoute>
                  <RecommendedDoctors />
                </ProtectRoute>
              } />

              <Route path="/doctor/book-appointment/:doctorId" element={<BookingPage />} />

              <Route path="/notification" element={
                <ProtectRoute>
                  <Notification/>
                </ProtectRoute>
              } />
            <Route path="/login" element={
              <PublicRoute>
                  <Login />
              </PublicRoute>
              } />
            <Route path="/register" element={
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
              <Route path="/landing" element={
                <PublicRoute>
                <LandingPage />
                </PublicRoute>
              } />
               

              <Route path="/" element={
                <ProtectRoute>
                  {/* eslint-disable-next-line */}
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
