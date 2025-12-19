import React, { useState } from "react";
import "./Style.css";

const EditProfile = ({ patient }) => {
  const [form, setForm] = useState(patient.medicalInfo || {});
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token stored during login

      const res = await fetch("http://localhost:5000/api/patient/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token // Send token to authorize request
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state and storage with new data from server
        localStorage.setItem("patient", JSON.stringify(data));
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
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
