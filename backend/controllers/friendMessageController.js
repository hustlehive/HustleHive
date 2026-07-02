const asyncHandler = require("express-async-handler");

const FriendConversation = require("../models/friendConversationModel");
const FriendMessage = require("../models/friendMessageModel");
const FriendRequest = require("../models/friendRequestModel");
const User = require("../models/userModel");
const { getIO } = require("../socket/socketService");
const { getSocketId } = require("../socket/socketManager");


const sendMessage = asyncHandler(async (req, res) => {

    const { content } = req.body;

    const friendId = req.params.friendId;

    if (!content) {
        res.status(400);
        throw new Error("Message content is required");
    }

    // Check if friend exists
    const friend = await User.findById(friendId);

    if (!friend) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check friendship
    const friendship = await FriendRequest.findOne({
        status: "accepted",
        $or: [
            {
                sender: req.user._id,
                receiver: friendId
            },
            {
                sender: friendId,
                receiver: req.user._id
            }
        ]
    });

    if (!friendship) {
        res.status(403);
        throw new Error("You can only message your friends");
    }

    // Find conversation
    let conversation = await FriendConversation.findOne({
        participants: {
            $all: [req.user._id, friendId]
        }
    });

    // Create if not exists
    if (!conversation) {

        conversation = await FriendConversation.create({
            participants: [
                req.user._id,
                friendId
            ]
        });

    }

    // Save message
    const message = await FriendMessage.create({

        conversation: conversation._id,

        sender: req.user._id,

        content

    });

    // Update conversation
    conversation.lastMessage = message._id;

    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    const receiverSocketId = getSocketId(friendId);

    if (receiverSocketId) {
        const io = getIO();

        io.to(receiverSocketId).emit(
            "new-message",
            {
                conversationId:
                    conversation._id,

                message
            }
        );
    }

    res.status(201).json({
        success: true,
        message
    });

});


const getMessages = asyncHandler(async (req, res) => {

    const friendId = req.params.friendId;

    if (friendId == req.user.id) {
        res.status(400);
        throw new Error("Friend id requested is same as logged in user id");
    }

    const conversation =
        await FriendConversation.findOne({
            participants: {
                $all: [
                    req.user._id,
                    friendId
                ]
            }
        });

    if (!conversation) {

        return res.status(200).json({
            success: true,
            messages: []
        });

    }

    const messages =
        await FriendMessage.find({
            conversation:
                conversation._id
        })
            .populate(
                "sender",
                "username fullName profilePic"
            )
            .sort({
                createdAt: 1
            });

    res.status(200).json({

        success: true,

        messages

    });

});


const getInbox = asyncHandler(async (req, res) => {

    const conversations =
        await FriendConversation.find({
            participants: req.user._id
        })
            .populate(
                "participants",
                "username fullName profilePic"
            )
            .populate(
                "lastMessage",
                "content type sender createdAt"
            )
            .sort({
                lastMessageAt: -1
            });

    const inbox = conversations.map(conversation => {

        const friend =
            conversation.participants.find(
                participant =>
                    participant._id.toString() !==
                    req.user._id.toString()
            );

        return {

            conversationId:
                conversation._id,

            friend,

            lastMessage:
                conversation.lastMessage,

            lastMessageAt:
                conversation.lastMessageAt

        };

    });

    res.status(200).json({

        success: true,

        inbox

    });

});

const markConversationAsRead = asyncHandler(async (req, res) => {

    const conversationId = req.params.conversationId;

    // Check conversation exists
    const conversation = await FriendConversation.findById(
        conversationId
    );

    if (!conversation) {

        res.status(404);
        throw new Error("Conversation not found");

    }

    // Verify user belongs to conversation
    if (
        !conversation.participants.some(
            participant =>
                participant.toString() ===
                req.user._id.toString()
        )
    ) {

        res.status(403);
        throw new Error("Not authorized");

    }

    // Mark every unread message
    await FriendMessage.updateMany(

        {
            conversation: conversationId,

            sender: {
                $ne: req.user._id
            },

            isRead: false
        },

        {
            isRead: true
        }

    );

    res.status(200).json({

        success: true,

        message: "Conversation marked as read"

    });

});


module.exports = {
    sendMessage,
    getMessages,
    getInbox,
    markConversationAsRead
};