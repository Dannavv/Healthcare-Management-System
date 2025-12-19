const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  bookAppointment,
  getMyAppointments,
} = require("../controllers/appointment.controller");

router.post("/", auth(["patient"]), bookAppointment);
router.get("/me", auth(), getMyAppointments);

module.exports = router;
