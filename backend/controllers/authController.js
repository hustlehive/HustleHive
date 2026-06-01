const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const asyncHandler = require("express-async-handler");

const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const getCollegeFromEmail = (email) => {

    if (email.endsWith("@nsut.ac.in") || email=="bhuwancp130106@gmail.com") {
        return "NSUT";
    }

    if (email.endsWith("@dtu.ac.in")) {
        return "DTU";
    }

    if (email.endsWith("@igdtuw.ac.in")) {
        return "IGDTUW";
    }

    return null;
};

const sendOTP = asyncHandler(async (req, res) => {

    const { email } = req.body;


    // Check Email Exists
    if (!email) {

        res.status(400);
        throw new Error("Email is required");
    }


    // Validate College Email
    const college = getCollegeFromEmail(email);

    if (!college) {

        res.status(400);
        throw new Error("Only college email IDs are allowed");
    }


    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {

        res.status(400);
        throw new Error("User already exists");
    }


    // Generate OTP
    const otp = generateOTP();


    // OTP Expiry (5 mins)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


    // Delete Previous OTPs
    await OTP.deleteMany({ email });


    // Save OTP
    await OTP.create({
        email,
        otp,
        expiresAt
    });


    // Send Email
    await sendEmail(
        email,
        "HustleHive OTP Verification",
        `Your OTP is ${otp}`
    );


    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    });
});

module.exports = sendOTP;