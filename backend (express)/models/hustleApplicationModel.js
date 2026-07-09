const mongoose = require("mongoose");

const hustleApplicationSchema = mongoose.Schema(
    {
        hustle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hustle",
            required: true
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const HustleApplication = mongoose.model(
    "HustleApplication",
    hustleApplicationSchema
);

module.exports = HustleApplication;