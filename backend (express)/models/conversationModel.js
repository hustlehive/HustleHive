const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        joinedAt: {
            type: Date,
            default: Date.now
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["friend", "hustle"],
            required: true
        },

        participants: {
            type: [participantSchema],
            validate: {
                validator: function (participants) {
                    return participants.length === 2;
                },
                message: "Conversation must have exactly two participants."
            }
        },

        hustle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hustle",
            default: null
        },

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
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

module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);