const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const asyncHandler = require("express-async-handler");

const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../config/cloudinary");

const getCollegeFromEmail = (email) => {

    if (email.endsWith("@nsut.ac.in")) {
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
        purpose: "register",
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
    let profilePic = {
        url: "",
        publicId: ""
    };

    if (req.file) {
        console.log(req.file);
        profilePic = {
            url: req.file.path,
            publicId: req.file.filename
        };
    }

    const {
        fullName,
        username,
        email,
        password,
        otp
    } = req.body;

    username = username.toLowerCase();

    // Check Required Fields
    if (!fullName || !username || !email || !password || !otp) {
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

        res.status(400);
        throw new Error("All fields are required");
    }


    // Validate College Email
    const college = getCollegeFromEmail(email);

    if (!college) {
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

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
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

        res.status(400);
        throw new Error("User already exists");
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

        res.status(400);
        throw new Error("OTP not found");
    }

    // Check OTP Match
    if (otpRecord.otp !== otp) {
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

        res.status(400);
        throw new Error("Invalid OTP");
    }

    // Check OTP Expiry
    if (Date.now() > otpRecord.expiresAt) {
        if (profilePic.publicId) {
            console.log(profilePic);
            const imageDeleteResult = await cloudinary.uploader.destroy(profilePic.publicId);
            console.log(imageDeleteResult);
        }

        res.status(400);
        throw new Error("OTP expired");
    }

    // Create User
    const user = await User.create({
        fullName,
        username,
        email,
        password,
        college,
        profilePic
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
            role: user.role,
            profilePic: profilePic
        }
    });
});


const loginUser = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    // Validate Fields
    if (!identifier || !password) {
        res.status(400);
        throw new Error("Identifier and password are required");
    }

    // Find User
    const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier }
        ]
    });

    if (!user) {
        res.status(401);
        throw new Error("Invalid username/email or password");
    }

    if (user.isDeleted) {
        res.status(403);
        throw new Error("This account has been deleted");
    }

    if(user.isBanned){
        res.status(403);
        throw new Error("Account has been banned");
    }


    // Compare Password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid username/email or password");
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
            role: user.role,
            profilePic: user.profilePic
        }
    });
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const otp = generateOTP();

    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    await OTP.deleteMany({
        email,
        purpose: "forgot-password"
    });

    await OTP.create({
        email,
        otp,
        purpose: "forgot-password",
        expiresAt
    });

    await sendEmail(
        email,
        "HustleHive Password Reset OTP",
        `Hi ${user.fullName}! Your password reset OTP is ${otp}`
    );

    res.status(200).json({
        success: true,
        message: "Password reset OTP sent successfully"
    });
});

const resetPassword = asyncHandler(async (req, res) => {

    const {
        email,
        otp,
        newPassword
    } = req.body;

    if (
        !email ||
        !otp ||
        !newPassword
    ) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const otpRecord = await OTP.findOne({
        email,
        purpose: "forgot-password"
    });

    if (!otpRecord) {
        res.status(400);
        throw new Error("OTP not found");
    }

    if (otpRecord.otp !== otp) {
        res.status(400);
        throw new Error("Invalid OTP");
    }

    if (Date.now() > otpRecord.expiresAt) {
        res.status(400);
        throw new Error("OTP expired");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.password = newPassword;

    await user.save();

    await OTP.deleteMany({
        email,
        purpose: "forgot-password"
    });

    // await sendEmail(
    //     email,
    //     "HustleHive Password changed",
    //     `Hi ${user.fullName}! Your HustleHive password has been changed succesfully.`
    // );

    res.status(200).json({
        success: true,
        message: "Password reset successful"
    });
});

module.exports = {
    sendOTP,
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword
};
