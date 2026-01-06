import React, { useState } from "react";
import "../../Style/Style.css";

const PatientGoals = ({
  appointment,
  goals,
  onSetGoal,
  canSetGoal
}) => {
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");

  const submitGoal = () => {
    setError("");

    if (!type || !target) {
      setError("Please select goal type and target");
      return;
    }

    // 🔴 API VERSION (future)
    /*
    await fetch("/api/goals", {
      method: "POST",
      body: JSON.stringify({
        patientEmail: appointment.patientEmail,
        type,
        target
      })
    });
    */

    onSetGoal(appointment.patientEmail, type, target);
    setType("");
    setTarget("");
  };

  return (
    <div className="panel">
      <h3>Patient: {appointment.patientName}</h3>

      <p>
        Appointment Date: <strong>{appointment.date}</strong>
      </p>

      {/* GOALS LIST */}
      <h4>Assigned Goals</h4>
      {goals.length === 0 ? (
        <p>No goals assigned</p>
      ) : (
        <ul className="goal-list">
          {goals.map((g, i) => (
            <li key={i}>
              <strong>{g.type}</strong>: {g.target}
              <span className="goal-status">
                Status: {g.status || "pending"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* GOAL FORM */}
      {canSetGoal ? (
        <>
          <h4>Set New Goal</h4>

          {error && <p className="error-msg">{error}</p>}

          <div className="goal-form">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Goal Type</option>
              <option>Steps</option>
              <option>Water</option>
              <option>Sleep</option>
              <option>Exercise</option>
            </select>

            <input
              type="text"
              placeholder="Target (e.g. 8000 steps/day)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />

            <button onClick={submitGoal}>
              Assign Goal
            </button>
          </div>
        </>
      ) : (
        <p className="info-msg">
          Goals can be assigned only after the patient visit.
        </p>
      )}
    </div>
  );
};

export default PatientGoals;
