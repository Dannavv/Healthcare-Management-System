import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Style.css";

const Home = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const patient = JSON.parse(localStorage.getItem("patient"));
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const handlePrimaryCTA = () => {
    if (patient) navigate("/Patient_dashboard");
    else if (doctor) navigate("/Doctor_dashboard");
    else navigate("/Login_patient");
  };

  return (
    <div className="home-wrapper">
      <div className="home-blob"></div> {/* Background accent */}
      <div className="home-card">
        <header className="home-header">
          <h1 className="home-title">
            Your Health, <br />
            <span className="accent-text">Our Priority.</span>
          </h1>
          <p className="home-description">
            Experience seamless healthcare management. Track wellness, 
            manage appointments, and connect with experts effortlessly.
          </p>
        </header>

        <div className="home-actions">
          <button className="btn-primary" onClick={handlePrimaryCTA}>
            {patient ? "Go to Dashboard" : doctor ? "Doctor Dashboard" : "Book Appointment"}
          </button>

          {!token && (
            <div className="login-group">
              <button className="btn-secondary" onClick={() => navigate("/Login_patient")}>
                Patient Login
              </button>
              <div className="divider"></div>
              <button className="btn-secondary" onClick={() => navigate("/Login_doctor")}>
                Doctor Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;