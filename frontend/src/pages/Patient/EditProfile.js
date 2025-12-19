import React, { useState } from "react";
import "./Style.css";

const EditProfile = ({ patient }) => {
  const [form, setForm] = useState(patient.medicalInfo || {});
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = () => {
    // 🔴 API VERSION
    /*
    await fetch("/api/patient/profile", ...)
    */

    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const updated = patients.map((p) =>
      p.email === patient.email
        ? { ...p, medicalInfo: form }
        : p
    );

    localStorage.setItem("patients", JSON.stringify(updated));
    localStorage.setItem(
      "patient",
      JSON.stringify({ ...patient, medicalInfo: form })
    );

    setMessage("Profile updated successfully");
  };

  return (
    <div>
      <h3>Edit Profile</h3>

      <input
        name="age"
        placeholder="Age"
        value={form.age || ""}
        onChange={handleChange}
      />

      <input
        name="bloodGroup"
        placeholder="Blood Group"
        value={form.bloodGroup || ""}
        onChange={handleChange}
      />

      <input
        name="allergies"
        placeholder="Allergies"
        value={form.allergies || ""}
        onChange={handleChange}
      />

      <input
        name="medications"
        placeholder="Medications"
        value={form.medications || ""}
        onChange={handleChange}
      />

      <button onClick={saveProfile}>Save</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProfile;
