import React, { useState, useEffect } from "react";
import "../../Style/Style.css";

const BookAppointment = ({ patient, onBooked }) => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to load doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  // Map "expertise" from doctorProfile for the dropdown
  const specializations = [
    ...new Set(doctors.map((d) => d.doctorProfile?.expertise))
  ].filter(Boolean);

  const filteredDoctors = doctors.filter(
    (d) => d.doctorProfile?.expertise === specialization
  );

  const handleBook = async (slotString, dayName) => { // Accept dayName as an argument
  setLoading(true);
  setMessage("");

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/patient/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        doctorId: selectedDoctor._id,
        date: dayName,  // Use the passed argument instead of state
        hour: slotString,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Booked for ${dayName} at ${slotString}!`);
      if (onBooked) onBooked();
    } else {
      setMessage(data.message || "Booking failed");
    }
  } catch (err) {
    setMessage("Server error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="book-container">
      <h3>Book Appointment</h3>

      {/* 1. Specialization Select */} 
      <div className="form-group">
        <label>Specialization (Expertise)</label>
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">Select Expertise</option>
          {specializations.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 2. Doctor Select */}
      {specialization && (
        <div className="form-group">
          <label>Doctor</label>
          <select onChange={(e) => setSelectedDoctor(doctors.find(d => d._id === e.target.value))}>
            <option value="">Select Doctor</option>
            {filteredDoctors.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Availability Display */}
      {selectedDoctor && (
        <div className="availability-info">
          <h4>Available Slots for Dr. {selectedDoctor.name}</h4>
          {selectedDoctor.doctorProfile.availability.map((avail) => (
            <div key={avail._id} className="day-section">
              <strong>{avail.day}:</strong>
              <div className="slots-grid">
                {avail.slots.map((slot) => (
                  <button
                    key={slot}
                    className="slot-button"
                    onClick={() => {
                      setSelectedDate(avail.day); // Setting day as date for now
                      handleBook(slot);
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default BookAppointment;