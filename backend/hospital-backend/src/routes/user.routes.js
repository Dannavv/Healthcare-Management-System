const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const { updateMyProfile, signupPatient } = require("../controllers/user.controller");

router.post("/signup", signupPatient);
router.put("/me", auth(["patient"]), updateMyProfile);

module.exports = router;

