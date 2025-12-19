// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Home from "./pages/Home";
import LoginDoctor from "./pages/Doctor/LoginDoctor";
import SignupDoctor from "./pages/Doctor/SignupDoctor";
import LoginPatient from "./pages/Patient/LoginPatient";
import SignupPatient from "./pages/Patient/SignupPatient";
import Dashboard from "./pages/Doctor/Dashboard";
import PatientDashboard from "./pages/Patient/Dashboard";
import Navbar from "./pages/Navbar";



function App() {
  return (
    <Router>
      <div >
        <Navbar />
      
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/Login_doctor" element={<LoginDoctor />} />
        <Route path="/Signup_doctor" element={<SignupDoctor />} />
        <Route path="/Login_patient" element={<LoginPatient />} />
        <Route path="/Signup_patient" element={<SignupPatient />} />
        <Route path="/Doctor_dashboard" element={<Dashboard />} />
        <Route path="/Patient_dashboard" element={<PatientDashboard />} />

      </Routes>
      {/* <Footer /> */}
      </div>

    </Router>
  );
}

export default App;


