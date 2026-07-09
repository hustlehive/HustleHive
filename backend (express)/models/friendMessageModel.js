const mongoose = require("mongoose");

const friendMessageSchema = mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FriendConversation",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "text",
                "image",
                "file"
            ],
            default: "text"
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const FriendMessage = mongoose.model(
    "FriendMessage",
    friendMessageSchema
);

module.exports = FriendMessage;