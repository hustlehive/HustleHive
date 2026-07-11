const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const uploadProfileImage=require("../middleware/uploadProfileImage");

const {
    sendOTP,
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/register", uploadProfileImage.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;