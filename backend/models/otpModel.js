const mongoose = require("mongoose");

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
        },

        purpose: {
            type: String,
            enum: ["register", "forgot-password"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;