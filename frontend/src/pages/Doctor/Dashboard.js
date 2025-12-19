import React, { useEffect, useState } from "react";
import "../../Style/Style.css";
import PatientDetail from "./PatientGoals";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(
      allAppointments
        .filter((a) => a.doctorEmail === doctor.email)
        .sort((a, b) => a.hour - b.hour)
    );
    const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(storedGoals);
  }, [doctor.email]);

  const filteredAppointments = selectedDate
    ? appointments.filter((a) => a.date === selectedDate)
    : appointments;

  const today = new Date().toISOString().split("T")[0];
  const todaysCount = appointments.filter((a) => a.date === today).length;

  const setGoalForPatient = (patientEmail, type, target) => {
    const updatedGoals = [
      ...goals,
      { doctorEmail: doctor.email, patientEmail, type, target }
    ];
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  return (
    <div className="doctor-dashboard-container animate-fade-in">
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div className="header-info">
          <h1>Welcome, Dr. {doctor.name}</h1>
          <span className="specialization-badge">{doctor.specialization}</span>
        </div>
        
        <div className="summary-cards">
          <div className="stat-card">
            <span className="stat-label">Total Visits</span>
            <span className="stat-value">{appointments.length}</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-label">Today's Schedule</span>
            <span className="stat-value">{todaysCount}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* LEFT COLUMN: APPOINTMENTS */}
        <section className="appointments-section">
          <div className="section-header">
            <h3>Schedule</h3>
            <div className="filter-group">
              <input
                type="date"
                className="date-picker"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="appointment-list">
            {filteredAppointments.length === 0 ? (
              <div className="empty-state">No appointments found</div>
            ) : (
              filteredAppointments.map((a, i) => (
                <div 
                  key={i} 
                  className={`appointment-item ${selectedPatient === a ? 'selected' : ''}`}
                  onClick={() => setSelectedPatient(a)}
                >
                  <div className="time-slot">{a.hour}:00</div>
                  <div className="patient-info">
                    <p className="patient-name">{a.patientName}</p>
                    <p className="appointment-date">{a.date}</p>
                  </div>
                  <div className="status-dot"></div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: PATIENT DETAILS */}
        <section className="details-section">
          {selectedPatient ? (
            <div className="details-wrapper">
              <PatientDetail
                appointment={selectedPatient}
                goals={goals.filter(
                  (g) => g.patientEmail === selectedPatient.patientEmail
                )}
                onSetGoal={setGoalForPatient}
              />
            </div>
          ) : (
            <div className="select-prompt">
              <div className="prompt-icon">📋</div>
              <p>Select a patient from the list to view details and set wellness goals.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;