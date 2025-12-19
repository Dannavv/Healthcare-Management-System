const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    target: Number,
    current: { type: Number, default: 0 },
    unit: String,
    date: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
