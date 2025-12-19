import React, { useState } from "react";
import "../../Style/Style.css";

const BookAppointment = ({ patient, onBooked }) => {
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];

  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");

  const specializations = [
    ...new Set(doctors.map((d) => d.specialization))
  ];

  const filteredDoctors = doctors.filter(
    (d) => d.specialization === specialization
  );

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const bookSlot = (hour) => {
    const conflict = appointments.some(
      (a) =>
        a.doctorEmail === selectedDoctor.email &&
        a.date === selectedDate &&
        a.hour === hour
    );

    if (conflict) {
      setMessage("Slot already booked");
      return;
    }

    // 🔴 API VERSION
    /*
    await fetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify({ doctorId, patientId, date, hour })
    });
    */

    const updatedAppointments = [
      ...appointments,
      {
        doctorEmail: selectedDoctor.email,
        doctorName: selectedDoctor.name,
        patientEmail: patient.email,
        patientName: patient.name,
        date: selectedDate,
        hour
      }
    ];

    localStorage.setItem(
      "appointments",
      JSON.stringify(updatedAppointments)
    );

    setMessage("Appointment booked successfully");
    onBooked();
  };

  return (
    <div className="book-container">
      <h3>Book Appointment</h3>

      {/* Specialization */}
      <div className="form-group">
        <label>Specialization</label>
        <select
          value={specialization}
          onChange={(e) => {
            setSpecialization(e.target.value);
            setSelectedDoctor(null);
            setSelectedDate("");
          }}
        >
          <option value="">Select</option>
          {specializations.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      {specialization && (
        <div className="form-group">
          <label>Doctor</label>
          <select
            onChange={(e) =>
              setSelectedDoctor(
                filteredDoctors.find(
                  (d) => d.email === e.target.value
                )
              )
            }
          >
            <option value="">Select Doctor</option>
            {filteredDoctors.map((d) => (
              <option key={d.email} value={d.email}>
                Dr. {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date */}
      {selectedDoctor && (
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              if (isWeekend(e.target.value)) {
                setMessage("Weekends are not allowed");
                setSelectedDate("");
              } else {
                setMessage("");
                setSelectedDate(e.target.value);
              }
            }}
          />
        </div>
      )}

      {/* Slots */}
      {selectedDoctor && selectedDate && (
        <div className="slots">
          {Array.from(
            {
              length:
                selectedDoctor.availability.endHour -
                selectedDoctor.availability.startHour
            },
            (_, i) => {
              const hour =
                selectedDoctor.availability.startHour + i;

              const booked = appointments.some(
                (a) =>
                  a.doctorEmail === selectedDoctor.email &&
                  a.date === selectedDate &&
                  a.hour === hour
              );

              return (
                <div
                  key={hour}
                  className={`slot ${
                    booked ? "booked" : "available"
                  }`}
                  onClick={() => !booked && bookSlot(hour)}
                >
                  {hour}:00 - {hour + 1}:00
                  <span>{booked ? "Booked" : "Available"}</span>
                </div>
              );
            }
          )}
        </div>
      )}

      {message && <p className="error-msg">{message}</p>}
    </div>
  );
};

export default BookAppointment;
