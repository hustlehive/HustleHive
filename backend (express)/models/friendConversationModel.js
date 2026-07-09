const mongoose = require("mongoose");

const friendConversationSchema = mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FriendMessage",
            default: null
        },

        lastMessageAt: {
            type: Date,
            default: null
        },
        unreadCounts: {
            type: Map,
            of: Number,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

const FriendConversation = mongoose.model(
    "FriendConversation",
    friendConversationSchema
);

module.exports = FriendConversation;