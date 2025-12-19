import React, { useState } from "react";
import "../../Style/Style.css";

const PatientDetail = ({ appointment, goals, onSetGoal }) => {
  const patients = JSON.parse(localStorage.getItem("patients")) || [];
  const patient = patients.find(
    (p) => p.email === appointment.patientEmail
  );

  const [type, setType] = useState("");
  const [target, setTarget] = useState("");

  return (
    <div className="panel">
      <h3>Patient Details</h3>

      <p><strong>Name:</strong> {appointment.patientName}</p>
      <p><strong>Email:</strong> {appointment.patientEmail}</p>

      {patient?.medicalInfo && (
        <>
          <p><strong>Age:</strong> {patient.medicalInfo.age}</p>
          <p><strong>Blood Group:</strong> {patient.medicalInfo.bloodGroup}</p>
          <p><strong>Allergies:</strong> {patient.medicalInfo.allergies}</p>
          <p><strong>Medications:</strong> {patient.medicalInfo.medications}</p>
        </>
      )}

      <h4>Assigned Goals</h4>
      {goals.length === 0 ? (
        <p>No goals yet</p>
      ) : (
        <ul className="goal-list">
          {goals.map((g, i) => (
            <li key={i}>
              {g.type}: {g.target}
            </li>
          ))}
        </ul>
      )}

      <div className="goal-form">
        <select onChange={(e) => setType(e.target.value)}>
          <option value="">Goal Type</option>
          <option>Steps</option>
          <option>Water</option>
          <option>Sleep</option>
          <option>Exercise</option>
        </select>

        <input
          placeholder="Target"
          onChange={(e) => setTarget(e.target.value)}
        />

        <button
          onClick={() => {
            if (type && target) {
              onSetGoal(appointment.patientEmail, type, target);
              setType("");
              setTarget("");
            }
          }}
        >
          Set Goal
        </button>
      </div>
    </div>
  );
};

export default PatientDetail;
