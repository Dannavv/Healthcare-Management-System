const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const goalRoutes = require("./routes/goal.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/goals", goalRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Hospital Backend API Running 🚀");
});

module.exports = app;
