import React, { useState } from "react";
import "./Style.css";

const BookAppointment = ({ patient, onBooked }) => {
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6;
  };

  const isPastSlot = (hour) => {
    return selectedDate === todayStr && hour <= currentHour;
  };

  const quickDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();

    return {
      date: dateStr,
      label: dayName,
      number: dayNum,
      disabled: isWeekend(dateStr)
    };
  });

  const bookSlot = (hour) => {
    try {
      setMessage("");
      if (!specialization) return setMessage("Please select specialization");
      if (!selectedDoctor) return setMessage("Please select doctor");
      if (!selectedDate) return setMessage("Please select date");
      if (isPastSlot(hour)) return setMessage("This time slot has already passed");

      setLoading(true);
      const conflict = appointments.some(
        (a) => a.doctorEmail === selectedDoctor.email && a.date === selectedDate && a.hour === hour
      );

      if (conflict) {
        setLoading(false);
        return setMessage("Slot already booked");
      }

      const updated = [
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

      localStorage.setItem("appointments", JSON.stringify(updated));
      setMessage("Appointment booked successfully");
      onBooked();
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const specializations = [...new Set(doctors.map((d) => d.specialization))];
  const filteredDoctors = doctors.filter((d) => d.specialization === specialization);

  return (
    <div className="book-appointment-card">
      <h3 className="section-title">Schedule Appointment</h3>

      <div className="booking-grid">
        {/* Step 1: Filters */}
        <div className="booking-form">
          <div className="form-group">
            <label className="input-label">Select Specialization</label>
            <select
              className="custom-select"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setSelectedDoctor(null);
                setSelectedDate("");
                setMessage("");
              }}
            >
              <option value="">Choose a Specialty</option>
              {specializations.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {specialization && (
            <div className="form-group animate-in">
              <label className="input-label">Select Doctor</label>
              <select
                className="custom-select"
                onChange={(e) => {
                  const doc = filteredDoctors.find((d) => d.email === e.target.value);
                  setSelectedDoctor(doc || null);
                  setSelectedDate("");
                  setMessage("");
                }}
              >
                <option value="">Choose a Physician</option>
                {filteredDoctors.map((d) => (
                  <option key={d.email} value={d.email}>
                    Dr. {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step 2: Date Selection */}
        {selectedDoctor && (
          <div className="date-selection-container animate-in">
            <label className="input-label">Available Dates</label>
            <div className="date-scroll-row">
              {quickDates.map((d) => (
                <button
                  key={d.date}
                  disabled={d.disabled}
                  className={`date-card ${selectedDate === d.date ? "active" : ""} ${d.disabled ? "disabled" : ""}`}
                  onClick={() => {
                    setSelectedDate(d.date);
                    setMessage("");
                  }}
                >
                  <span className="day-label">{d.label}</span>
                  <span className="day-number">{d.number}</span>
                </button>
              ))}
            </div>
            
            <div className="calendar-alt">
              <span>Or use calendar:</span>
              <input
                type="date"
                className="inline-date-picker"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  if (isWeekend(e.target.value)) {
                    setMessage("Weekends are not allowed");
                    setSelectedDate("");
                  } else {
                    setSelectedDate(e.target.value);
                    setMessage("");
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Slots */}
        {selectedDoctor && selectedDate && (
          <div className="time-slots-container animate-in">
            <label className="input-label">Select Time Slot</label>
            <div className="slots-grid">
              {Array.from(
                { length: selectedDoctor.availability.endHour - selectedDoctor.availability.startHour },
                (_, i) => {
                  const hour = selectedDoctor.availability.startHour + i;
                  const booked = appointments.some(
                    (a) => a.doctorEmail === selectedDoctor.email && a.date === selectedDate && a.hour === hour
                  );
                  const disabled = booked || isPastSlot(hour) || loading;

                  return (
                    <button
                      key={hour}
                      className={`time-slot-btn ${disabled ? "is-disabled" : "is-available"}`}
                      onClick={() => !disabled && bookSlot(hour)}
                    >
                      <span className="time-text">{hour}:00</span>
                      <span className="status-text">
                        {booked ? "Booked" : isPastSlot(hour) ? "Past" : "Free"}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`status-banner ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BookAppointment;