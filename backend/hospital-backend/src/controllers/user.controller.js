const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signupPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      bloodGroup,
      allergies,
      medications,
    } = req.body;

    // 🔴 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧠 Create patient
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient",
      patientProfile: {
        age,
        gender,
        bloodGroup,
        allergies: allergies
          ? allergies.split(",").map(a => a.trim())
          : [],
        medications: medications
          ? medications.split(",").map(m => m.trim())
          : [],
      },
    });

    res.status(201).json({
      message: "Patient registered successfully",
      userId: user._id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const { age, bloodGroup, allergies, medications } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.patientProfile = {
      age,
      bloodGroup,
      allergies: Array.isArray(allergies)
        ? allergies
        : allergies?.split(",").map(a => a.trim()),
      medications: Array.isArray(medications)
        ? medications
        : medications?.split(",").map(m => m.trim()),
    };

    await user.save();

    res.json({
      message: "Profile updated successfully",
      patientProfile: user.patientProfile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

