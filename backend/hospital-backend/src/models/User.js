const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },

    patientProfile: {
      age: Number,
      gender: String,
      bloodGroup: String,
      allergies: [String],
      medications: [String],
    },

    doctorProfile: {
      expertise: String,
      availability: [
        {
          day: String,
          slots: [String],
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
