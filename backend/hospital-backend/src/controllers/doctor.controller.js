const User = require("../models/User");
const Appointment = require("../models/Appointment");

// ----------------------------
// GET ALL DOCTORS
// ----------------------------
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// GET DOCTOR BY ID
// ----------------------------
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// UPDATE AVAILABILITY
// ----------------------------
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability) {
      return res.status(400).json({ message: "Availability required" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      "doctorProfile.availability": availability,
    });

    res.json({ message: "Availability updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// GET DOCTOR'S PATIENTS
// ----------------------------
exports.getMyPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    }).populate("patient", "name email");

    const patientsMap = new Map();

    appointments.forEach((appt) => {
      patientsMap.set(appt.patient._id.toString(), appt.patient);
    });

    res.json([...patientsMap.values()]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------
// DOCTOR DASHBOARD
// ----------------------------
exports.getDoctorDashboard = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({
      doctor: req.user.id,
    });

    const upcomingAppointments = await Appointment.find({
      doctor: req.user.id,
      datetime: { $gte: new Date() },
    }).populate("patient", "name");

    res.json({
      totalAppointments,
      upcomingAppointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
