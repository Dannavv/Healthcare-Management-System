import React, { useState } from "react";
import "../../Style/Style.css";

const LoginDoctor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Same hash logic as signup
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔴 API VERSION (enable later)
      /*
      const res = await fetch("http://localhost:8000/api/doctor/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      */

      // 🟢 DUMMY VERSION
      const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
      const hashedInput = await hashPassword(password);

      const doctor = doctors.find(
        (d) => d.email === email && d.password === hashedInput
      );

      if (!doctor) {
        throw new Error("Invalid email or password");
      }

      localStorage.setItem("token", "dummy-jwt-token");
      localStorage.setItem("doctor", JSON.stringify(doctor));

      window.location.href = "/Doctor_dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Doctor Login</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New Doctor?</span>
          <button
            className="link-button"
            onClick={() => (window.location.href = "/Signup_doctor")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginDoctor;
