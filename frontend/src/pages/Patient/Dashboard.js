import React, { useState, useEffect } from "react";
import "./Style.css";
import BookAppointment from "./BookAppointment";
import EditProfile from "./EditProfile";

const PatientDashboard = () => {
  const patient = JSON.parse(localStorage.getItem("patient"));
  const [appointments, setAppointments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    // 🔴 API VERSION
    /*
    fetch("/api/patient/appointments").then(...)
    fetch("/api/patient/goals").then(...)
    */

    // 🟢 DUMMY VERSION
    const allAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    const patientAppointments = allAppointments.filter(
      (a) => a.patientEmail === patient.email
    );

    setAppointments(patientAppointments);

    const allGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(allGoals.filter((g) => g.patientEmail === patient.email));
  }, [patient.email]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    window.location.href = "/Login_patient";
  };
  const cancelAppointment = (appointment) => {
    // 🔴 API VERSION
    /*
  await fetch(`/api/appointments/${appointment.id}`, {
    method: "DELETE"
  });
  */

    const allAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    const updated = allAppointments.filter(
      (a) =>
        !(
          a.patientEmail === appointment.patientEmail &&
          a.doctorEmail === appointment.doctorEmail &&
          a.date === appointment.date &&
          a.hour === appointment.hour
        )
    );

    localStorage.setItem("appointments", JSON.stringify(updated));
    setAppointments(updated.filter((a) => a.patientEmail === patient.email));
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {patient.name}</h2>

      <div className="dashboard-tabs">
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("book")}>Book Appointment</button>
        <button onClick={() => setView("profile")}>Edit Profile</button>
        <button onClick={logout}>Logout</button>
      </div>

      {view === "dashboard" && (
        <>
          <h3>Your Appointments</h3>
          {appointments.length === 0 ? (
            <p>No appointments yet</p>
          ) : (
            <ul className="list">
              {appointments.map((a, i) => (
                <li key={i}>
                  Dr. {a.doctorName} | {a.date} | {a.hour}:00 - {a.hour + 1}:00
                  <button
                    className="cancel-btn"
                    onClick={() => cancelAppointment(a)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3>Your Goals</h3>
          {goals.length === 0 ? (
            <p>No goals assigned</p>
          ) : (
            <ul className="list">
              {goals.map((g, i) => (
                <li key={i}>
                  <strong>{g.type}</strong>: {g.target}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {view === "book" && (
        <BookAppointment
          patient={patient}
          onBooked={() => setView("dashboard")}
        />
      )}

      {view === "profile" && <EditProfile patient={patient} />}
    </div>
  );
};

export default PatientDashboard;
