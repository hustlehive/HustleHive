const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    type: {
        type: String,
        enum: [
            "friend_request",
            "friend_accept",
            "hustle_application",
            "application_accepted",
            "application_rejected",
            "message",
            "hustle_deadline"
        ],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    referenceType: {
        type: String,
        enum: [
            "FriendRequest",
            "Application",
            "Conversation",
            "Hustle"
        ],
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);