const Goal = require("../models/Goals");

exports.createGoal = async (req, res) => {
  const { patientId, title, target, unit, date } = req.body;

  const goal = await Goal.create({
    patient: patientId,
    doctor: req.user.id,
    title,
    target,
    unit,
    date,
  });

  res.status(201).json(goal);
};

exports.updateGoal = async (req, res) => {
  const { id } = req.params;
  const { current } = req.body;

  await Goal.findByIdAndUpdate(id, { current });
  res.json({ message: "Goal updated" });
};

exports.getMyGoals = async (req, res) => {
  const goals = await Goal.find({ patient: req.user.id });
  res.json(goals);
};
