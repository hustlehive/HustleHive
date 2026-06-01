const express = require("express");
const router = express.Router();

const {
    sendOTP,
    registerUser
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/register", registerUser);

module.exports = router;