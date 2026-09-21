const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

    reportType: {
        type: String,
        enum: ["user", "hustle"],
        required: true
    },

    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    reportedHustle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hustle",
        default: null
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reason: {
        type: String,
        enum: [
            "Spam",
            "Harassment",
            "Scam",
            "Fake Profile",
            "Inappropriate Content",
            "Other"
        ],
        required: true
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "pending",
            "resolved",
            "dismissed"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

reportSchema.index(
    {
        reportType: 1,
        reportedUser: 1,
        reportedBy: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            reportType: "user"
        }
    }
);

reportSchema.index(
    {
        reportType: 1,
        reportedHustle: 1,
        reportedBy: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            reportType: "hustle"
        }
    }
);

module.exports = mongoose.model(
    "Report",
    reportSchema
);