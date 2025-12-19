import React, { useState } from "react";
import "../../Style/Style.css";

const SignupDoctor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    availableFrom: "10",
    availableTo: "17"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 Password Hashing (Dummy but Secure)
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

    const from = Number(form.availableFrom);
    const to = Number(form.availableTo);

    // ✅ Availability Validation
    if (from >= to) {
      setError("Available From time must be earlier than Available To time");
      return;
    }

    // 🔴 API VERSION (enable later)
    /*
    await fetch("http://localhost:8000/api/doctor/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    */

    // 🟢 DUMMY STORAGE
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    if (doctors.some((d) => d.email === form.email)) {
      setError("Doctor with this email already exists");
      return;
    }

    const hashedPassword = await hashPassword(form.password);

    doctors.push({
      name: form.name,
      email: form.email,
      password: hashedPassword,
      specialization: form.specialization,
      availability: {
        startHour: from,
        endHour: to
      }
    });

    localStorage.setItem("doctors", JSON.stringify(doctors));
    setMessage("Account created successfully. Please login.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Doctor Signup</h2>

        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSignup}>
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            name="specialization"
            placeholder="Specialization"
            required
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          {/* Availability */}
          <div className="availability-group">
            <label>Available Time</label>
            <div className="availability-select">
              <select
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>

              <span>to</span>

              <select
                name="availableTo"
                value={form.availableTo}
                onChange={handleChange}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button>Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupDoctor;
