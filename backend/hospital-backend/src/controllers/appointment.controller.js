const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  const { doctorId, datetime } = req.body;

  const appointment = await Appointment.create({
    patient: req.user.id,
    doctor: doctorId,
    datetime,
  });

  res.status(201).json(appointment);
};

exports.getMyAppointments = async (req, res) => {
  const filter =
    req.user.role === "doctor"
      ? { doctor: req.user.id }
      : { patient: req.user.id };

  const appointments = await Appointment.find(filter)
    .populate("patient doctor", "name email");

  res.json(appointments);
};
