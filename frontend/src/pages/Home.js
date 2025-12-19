import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Style.css";

const Home = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const patient = JSON.parse(localStorage.getItem("patient"));
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const handlePrimaryCTA = () => {
    if (patient) {
      navigate("/Patient_dashboard");
    } else if (doctor) {
      navigate("/Doctor_dashboard");
    } else {
      navigate("/Login_patient");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Your Health,
          <br />
          <span>Our Priority</span>
        </h1>

        <p className="home-subtitle">
          A simple and secure healthcare platform to manage appointments,
          track wellness goals, and stay connected with your doctor.
        </p>

        <div className="home-actions">
          {/* Primary CTA */}
          <button className="primary-btn" onClick={handlePrimaryCTA}>
            {patient
              ? "Go to Dashboard"
              : doctor
              ? "Doctor Dashboard"
              : "Book Appointment"}
          </button>

          {/* Show login options ONLY if not logged in */}
          {!token && (
            <div className="secondary-actions">
              <button
                className="link-button"
                onClick={() => navigate("/Login_patient")}
              >
                Patient Login
              </button>
              <span>|</span>
              <button
                className="link-button"
                onClick={() => navigate("/Login_doctor")}
              >
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
