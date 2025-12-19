const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  createGoal,
  updateGoal,
  getMyGoals,
} = require("../controllers/goal.controller");

router.post("/", auth(["doctor"]), createGoal);
router.put("/:id", auth(["patient"]), updateGoal);
router.get("/me", auth(["patient"]), getMyGoals);

module.exports = router;
