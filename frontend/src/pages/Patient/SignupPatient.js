import React, { useState } from "react";
import "../../Style/Style.css";

const SignupPatient = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    medications: ""
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 Hash password (same as doctor)
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // 🔴 API VERSION (enable later)
    /*
    await fetch("http://localhost:8000/api/patient/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    */

    await fetch("http://localhost:5000/api/auth/patient/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });


    // 🟢 DUMMY STORAGE
    const patients = JSON.parse(localStorage.getItem("patients")) || [];

    if (patients.some((p) => p.email === form.email)) {
      setError("Patient with this email already exists");
      return;
    }

    const hashedPassword = await hashPassword(form.password);

    patients.push({
      name: form.name,
      email: form.email,
      password: hashedPassword,
      medicalInfo: {
        age: form.age,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        allergies: form.allergies,
        medications: form.medications
      }
    });

    localStorage.setItem("patients", JSON.stringify(patients));
    setMessage("Account created successfully. Please login.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Patient Signup</h2>

        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSignup}>
          <input name="name" placeholder="Full Name" required onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} />

          <input name="age" placeholder="Age" onChange={handleChange} />

          <select name="gender" onChange={handleChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input name="bloodGroup" placeholder="Blood Group (e.g. O+)" onChange={handleChange} />
          <input name="allergies" placeholder="Allergies (comma separated)" onChange={handleChange} />
          <input name="medications" placeholder="Current Medications" onChange={handleChange} />

          <button>Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPatient;
