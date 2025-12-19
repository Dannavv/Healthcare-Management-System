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
    // 🔴 API VERSION
    /*
    fetch(`/api/doctor/appointments`).then(...)
    */

    const allAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

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

  const todaysCount = appointments.filter(
    (a) => a.date === today
  ).length;

  const setGoalForPatient = (patientEmail, type, target) => {
    const updatedGoals = [
      ...goals,
      {
        doctorEmail: doctor.email,
        patientEmail,
        type,
        target
      }
    ];

    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  return (
    <div className="dashboard">
      <h2>Welcome, Dr. {doctor.name}</h2>
      <p>{doctor.specialization}</p>

      {/* SUMMARY */}
      <div className="summary">
        <div>Total Appointments: {appointments.length}</div>
        <div>Today's Appointments: {todaysCount}</div>
      </div>

      {/* DATE FILTER */}
      <div className="form-group">
        <label>Filter by Date</label>
        <input
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* APPOINTMENTS LIST */}
      <h3>Appointments</h3>
      {filteredAppointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        <ul className="list">
          {filteredAppointments.map((a, i) => (
            <li key={i} onClick={() => setSelectedPatient(a)}>
              <strong>{a.patientName}</strong>
              <br />
              {a.date} | {a.hour}:00 - {a.hour + 1}:00
            </li>
          ))}
        </ul>
      )}

      {/* PATIENT DETAILS + GOALS */}
      {selectedPatient && (
        <PatientDetail
          appointment={selectedPatient}
          goals={goals.filter(
            (g) => g.patientEmail === selectedPatient.patientEmail
          )}
          onSetGoal={setGoalForPatient}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
