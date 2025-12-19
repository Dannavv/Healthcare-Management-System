const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth.middleware");
const {
  getAllDoctors,
  getDoctorById,
  updateAvailability,
  getMyPatients,
  getDoctorDashboard,
} = require("../controllers/doctor.controller");

// 🔓 List all doctors (patient / doctor)
router.get("/", auth(), getAllDoctors);

// 🔓 Get doctor profile by ID
router.get("/:id", auth(), getDoctorById);

// 🔐 Doctor updates availability
router.put("/availability/me", auth(["doctor"]), updateAvailability);

// 🔐 Doctor gets assigned patients
router.get("/me/patients", auth(["doctor"]), getMyPatients);

// 🔐 Doctor dashboard
router.get("/me/dashboard", auth(["doctor"]), getDoctorDashboard);


module.exports = router;
