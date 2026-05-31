const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;