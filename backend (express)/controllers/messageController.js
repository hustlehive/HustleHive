const asyncHandler = require("express-async-handler");
const createNotification = require("../utils/createNotification");

const mongoose = require("mongoose");
const Application = require("../models/hustleApplicationModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const FriendRequest = require("../models/friendRequestModel");
const Hustle = require("../models/hustleModel");
const User = require("../models/userModel");
const { getIO } = require("../socket/socketService");
const { getSocketId } = require("../socket/socketManager"); 

const startConversation = asyncHandler(async (req, res) => {

    const { type } = req.body;

    if (!type) {
        res.status(400);
        throw new Error("Conversation type is required");
    }

    if (type === "friend") {
        const { friendId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            res.status(400);
            throw new Error("Invalid friend id");

        }

        const friend =
            await User.findById(friendId);

        if (!friend) {
            res.status(404);
            throw new Error("User not found");

        }
        const friendship =
            await FriendRequest.findOne({

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
            throw new Error(
                "Users are not friends"
            );

        }
        let conversation =
            await Conversation.findOne({
                type: "friend",
                participants: {
                    $size: 2
                },
                "participants.user": {
                    $all: [req.user._id, friendId]
                }
            });

        if (!conversation) {
            conversation =
                await Conversation.create({
                    type: "friend",
                    participants: [
                        {
                            user: req.user._id
                        },
                        {
                            user: friendId
                        }
                    ]
                });
        }

        res.status(200).json({
            success: true,
            conversation
        });

    }

    else if (type === "hustle") {

        const { hustleId, participantId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(hustleId) ||
            !mongoose.Types.ObjectId.isValid(participantId)) {
            res.status(400);
            throw new Error("Invalid IDs");
        }

        const hustle = await Hustle.findById(hustleId);

        if (!hustle) {
            res.status(404);
            throw new Error("Hustle not found");
        }

        const isOwner =
            hustle.createdBy.toString() === req.user._id.toString();

        const application = await Application.findOne({
            hustle: hustleId,
            applicant: participantId
        });

        if (!application) {
            res.status(403);
            throw new Error("User has not applied for this hustle");
        }

        if (
            !isOwner &&
            participantId !== req.user._id.toString()
        ) {
            res.status(403);
            throw new Error("Not authorized");
        }

        const otherUserId = isOwner
            ? participantId
            : hustle.createdBy;

        const otherUser = await User.findById(otherUserId);

        if (!otherUser) {
            res.status(404);
            throw new Error("User not found");
        }

        let conversation = await Conversation.findOne({
            type: "hustle",
            hustle: hustleId,
            participants: { $size: 2 },
            "participants.user": {
                $all: [
                    req.user._id,
                    otherUserId
                ]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                type: "hustle",
                hustle: hustleId,
                participants: [
                    { user: req.user._id },
                    { user: otherUserId }
                ]
            });
        }

        res.status(200).json({
            success: true,
            conversation
        });
    }

    else {
        res.status(400);
        throw new Error("Invalid conversation type");
    }

});


const sendMessage = asyncHandler(async (req, res) => {

    const { conversationId, content, type = "text" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        res.status(400);
        throw new Error("Invalid conversation id");
    }

    if (!content) {
        res.status(400);
        throw new Error("Message content is required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        participant =>
            participant.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error("Not authorized");
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content,
        type
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;

    conversation.participants.forEach(participant => {

        const id = participant.user.toString();

        if (id !== req.user._id.toString()) {

            const currentUnread =
                conversation.unreadCounts.get(id) || 0;

            conversation.unreadCounts.set(
                id,
                currentUnread + 1
            );

        }

    });

    conversation.unreadCounts.set(
        req.user._id.toString(),
        0
    );

    await conversation.save();

    await message.populate(
        "sender",
        "username fullName profilePic"
    );

    await createNotification({
        receiver:receiver.user._id || receiver.user,
        sender: req.user._id,
        type: "message",
        title: "New Message",
        body: content,
        referenceId: conversation._id,
        referenceType: "Conversation"
    });

    const receiver = conversation.participants.find(
        participant =>
            participant.user.toString() !== req.user._id.toString()
    );

    const receiverSocketId =
        getSocketId(receiver.user.toString());

    if (receiverSocketId) {

        const io = getIO();

        io.to(receiverSocketId).emit(
            "new-message",
            {
                conversationId,
                message
            }
        );

    }

    res.status(201).json({
        success: true,
        message
    });

});


const getInbox = asyncHandler(async (req, res) => {

    const { type } = req.query;

    const query = {
        "participants.user": req.user._id
    };

    if (type) {
        query.type = type;
    }

    const conversations = await Conversation.find(query)
        .populate(
            "participants.user",
            "username fullName profilePic"
        )
        .populate(
            "lastMessage",
            "content type sender createdAt"
        )
        .sort({ lastMessageAt: -1 });

    const inbox = conversations.map(conversation => {

        const friend =
            conversation.participants.find(
                participant =>
                    participant.user._id.toString() !==
                    req.user._id.toString()
            );

        return {

            conversationId: conversation._id,

            type: conversation.type,

            hustle: conversation.hustle,

            user: friend.user,

            lastMessage: conversation.lastMessage,

            unreadCount:
                conversation.unreadCounts.get(
                    req.user._id.toString()
                ) || 0,

            lastMessageAt:
                conversation.lastMessageAt
        };

    });

    res.status(200).json({
        success: true,
        count: inbox.length,
        inbox
    });

});

const getMessages = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        res.status(400);
        throw new Error("Invalid conversation id");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        participant =>
            participant.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error("Not authorized");
    }

    const messages = await Message.find({
        conversation: conversationId
    })
        .populate(
            "sender",
            "username fullName profilePic"
        )
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });

});


const markConversationAsRead = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        res.status(400);
        throw new Error("Invalid conversation id");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        participant =>
            participant.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error("Not authorized");
    }

    await Message.updateMany(
        {
            conversation: conversationId,
            sender: { $ne: req.user._id },
            deletedForEveryone: false
        },
        {
            isRead: true
        }
    );

    conversation.unreadCounts.set(
        req.user._id.toString(),
        0
    );

    await conversation.save();

    res.status(200).json({
        success: true,
        message: "Conversation marked as read"
    });

});


const editMessage = asyncHandler(async (req, res) => {

    const { messageId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        res.status(400);
        throw new Error("Invalid message id");
    }

    const message = await Message.findById(messageId);

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    res.status(200).json({
        success: true,
        message
    });

});


const deleteMessageForEveryone = asyncHandler(async (req, res) => {

    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        res.status(400);
        throw new Error("Invalid message id");
    }

    const message = await Message.findById(messageId);

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    message.deletedForEveryone = true;
    message.content = "This message was deleted.";

    await message.save();

    res.status(200).json({
        success: true,
        message: "Message deleted"
    });

});


module.exports = {
    startConversation,
    sendMessage,
    getInbox,
    getMessages,
    markConversationAsRead,
    editMessage,
    deleteMessageForEveryone
};