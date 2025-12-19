import React, { useState, useEffect } from "react";
import "./Style.css";
import BookAppointment from "./BookAppointment";
import EditProfile from "./EditProfile";

const PatientDashboard = () => {
  const patient = JSON.parse(localStorage.getItem("patient"));
  const [appointments, setAppointments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [view, setView] = useState("dashboard");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
      setAppointments(allAppointments.filter((a) => a.patientEmail === patient.email));
      const allGoals = JSON.parse(localStorage.getItem("goals")) || [];
      setGoals(allGoals.filter((g) => g.patientEmail === patient.email));
    } catch (err) {
      setError("Failed to load dashboard data");
    }
  }, [patient.email]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    window.location.href = "/Login_patient";
  };

  const cancelAppointment = (appointment) => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
      const updated = allAppointments.filter(
        (a) => !(a.patientEmail === appointment.patientEmail && a.doctorEmail === appointment.doctorEmail && a.date === appointment.date && a.hour === appointment.hour)
      );
      localStorage.setItem("appointments", JSON.stringify(updated));
      setAppointments(updated.filter((a) => a.patientEmail === patient.email));
    } catch {
      setError("Unable to cancel appointment");
    }
  };

  const updateGoalStatus = (goal, status) => {
    try {
      const allGoals = JSON.parse(localStorage.getItem("goals")) || [];
      const updatedGoals = allGoals.map((g) =>
        g.patientEmail === goal.patientEmail && g.type === goal.type && g.target === goal.target
          ? { ...g, status } : g
      );
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      setGoals(updatedGoals.filter((g) => g.patientEmail === patient.email));
    } catch {
      setError("Failed to update goal");
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="avatar">{patient.name.charAt(0)}</div>
          <p>Welcome back,</p>
          <h3>{patient.name}</h3>
        </div>
        <nav className="dashboard-tabs">
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Overview</button>
          <button className={view === "book" ? "active" : ""} onClick={() => setView("book")}>Book Appointment</button>
          <button className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>My Profile</button>
          <button className="logout-tab" onClick={logout}>Logout</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {error && <div className="error-msg">{error}</div>}

        {view === "dashboard" && (
          <div className="dashboard-content animate-fade-in">
            <header className="content-header">
              <h2>Health Overview</h2>
              <p>Manage your upcoming visits and health targets.</p>
            </header>

            <section className="dashboard-section">
              <h3>Upcoming Appointments</h3>
              <div className="card-grid">
                {appointments.length === 0 ? (
                  <div className="empty-state">No appointments scheduled</div>
                ) : (
                  appointments.map((a, i) => (
                    <div className="card appointment-card" key={i}>
                      <div className="card-info">
                        <h4>Dr. {a.doctorName}</h4>
                        <p className="date-text">{a.date}</p>
                        <p className="time-text">{a.hour}:00 - {a.hour + 1}:00</p>
                      </div>
                      <button className="btn-outline-danger" onClick={() => cancelAppointment(a)}>Cancel</button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="dashboard-section">
              <h3>Wellness Goals</h3>
              <div className="card-grid">
                {goals.length === 0 ? (
                  <div className="empty-state">No wellness goals assigned</div>
                ) : (
                  goals.map((g, i) => (
                    <div className="card goal-card" key={i}>
                      <div className="goal-header">
                        <span className={`status-badge ${g.status || "pending"}`}>{g.status || "pending"}</span>
                        <h4>{g.type}</h4>
                      </div>
                      <p className="goal-target">{g.target}</p>
                      <div className="goal-actions">
                        <button className="btn-sm" onClick={() => updateGoalStatus(g, "in-progress")}>In Progress</button>
                        <button className="btn-sm btn-success" onClick={() => updateGoalStatus(g, "completed")}>Complete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {view === "book" && <div className="p-4"><BookAppointment patient={patient} onBooked={() => setView("dashboard")} /></div>}
        {view === "profile" && <div className="p-4"><EditProfile patient={patient} /></div>}
      </main>
    </div>
  );
};

export default PatientDashboard;