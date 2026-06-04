const mongoose = require("mongoose");

const hustleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            maxlength: 1000
        },

        reward: {
            type: Number,
            required: true,
            min: 0
        },

        photo: {
            type: String,
            default: ""
        },

        deadline: {
            type: Date,
            required: true
        },

        college: {
            type: String,
            enum: ["NSUT", "DTU", "IGDTUW"],
            required: true
        },

        status: {
            type: String,
            enum: ["active", "assigned", "completed", "cancelled"],
            default: "active"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Hustle = mongoose.model("Hustle", hustleSchema);

module.exports = Hustle;