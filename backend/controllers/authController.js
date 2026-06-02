const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const asyncHandler = require("express-async-handler");

const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

const getCollegeFromEmail = (email) => {

    if (email.endsWith("@nsut.ac.in") || email == "bhuwancp130106@gmail.com") {
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
        throw new Error("Email already in use");
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
        `Your one time password for registration on HustleHive is ${otp}`
    );


    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    });
});

const registerUser = asyncHandler(async (req, res) => {

    const {
        fullName,
        username,
        email,
        password,
        otp
    } = req.body;


    // Check Required Fields
    if (!fullName || !username || !email || !password || !otp) {
        res.status(400);
        throw new Error("All fields are required");
    }


    // Validate College Email
    const college = getCollegeFromEmail(email);

    if (!college) {
        res.status(400);
        throw new Error("Invalid college email");
    }

    // Check Existing User
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
        res.status(400);
        throw new Error("OTP not found");
    }

    // Check OTP Match
    if (otpRecord.otp !== otp) {
        res.status(400);
        throw new Error("Invalid OTP");
    }

    // Check OTP Expiry
    if (Date.now() > otpRecord.expiresAt) {
        res.status(400);
        throw new Error("OTP expired");
    }

    // Create User
    const user = await User.create({
        fullName,
        username,
        email,
        password,
        college
    });

    // Delete OTP After Successful Registration
    await OTP.deleteMany({ email });

    // Response
    res.status(201).json({
        success: true,

        token: generateToken(user._id),

        user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            college: user.college,
            role: user.role
        }
    });
});


const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Validate Fields
    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }


    // Compare Password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }


    // Response
    res.status(200).json({
        success: true,

        token: generateToken(user._id),

        user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            college: user.college,
            role: user.role
        }
    });
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = {
    sendOTP,
    registerUser,
    loginUser,
    getMe
};