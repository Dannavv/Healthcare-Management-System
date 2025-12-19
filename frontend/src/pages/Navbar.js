import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/Style.css";

const Navbar = () => {
  const navigate = useNavigate();

  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const patient = JSON.parse(localStorage.getItem("patient"));
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
    localStorage.removeItem("patient");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          HCLcare+
        </Link>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Not Logged In */}
        {!token && (
          <>
            <Link to="/Login_doctor">Doctor Login</Link>
            <Link to="/Login_patient">Patient Login</Link>
          </>
        )}

        {/* Doctor Logged In */}
        {doctor && (
          <>
            <Link to="/Doctor_dashboard">Dashboard</Link>
            <span className="user-badge">Dr. {doctor.name}</span>
            <button className="nav-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* Patient Logged In */}
        {patient && (
          <>
            <Link to="/Patient_dashboard">Dashboard</Link>
            <span className="user-badge">{patient.name}</span>
            <button className="nav-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
