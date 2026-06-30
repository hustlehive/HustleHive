const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");


const sendFriendRequest = asyncHandler(async (req, res) => {

    const receiverId = req.params.userId;

    if (receiverId === req.user._id.toString()) {
        res.status(400);
        throw new Error("Cannot send request to yourself");
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
        res.status(404);
        throw new Error("User not found");
    }

    const existingRequest =
        await FriendRequest.findOne({
            $or: [
                {
                    sender: req.user._id,
                    receiver: receiverId
                },
                {
                    sender: receiverId,
                    receiver: req.user._id
                }
            ]
        });

    if (existingRequest) {
        if (existingRequest.status === "accepted") {
            res.status(400);
            throw new Error("Already friends with the user");
        }
        res.status(400);
        throw new Error(
            "Friend request already exists"
        );
    }

    const request = await FriendRequest.create({
        sender: req.user._id,
        receiver: receiverId
    });

    res.status(201).json({
        success: true,
        request
    });
});


const getReceivedRequests = asyncHandler(async (req, res) => {

    const requests = await FriendRequest.find({
        receiver: req.user._id,
        status: "pending"
    }).populate(
        "sender",
        "username fullName college profilePic bio"
    );

    res.status(200).json({
        success: true,
        count: requests.length,
        requests
    });
});



const acceptFriendRequest = asyncHandler(async (req, res) => {

    const request =
        await FriendRequest.findById(
            req.params.requestId
        );

    if (!request) {
        res.status(404);
        throw new Error(
            "Friend request not found"
        );
    }

    if (
        request.receiver.toString() !==
        req.user._id.toString()
    ) {
        res.status(403);
        throw new Error("Not authorized");
    }

    if (request.status === "accepted") {
        res.status(400);
        throw new Error("Already accepted");
    }

    request.status = "accepted";

    await request.save();

    res.status(200).json({
        success: true,
        message:
            "Friend request accepted"
    });
});


const rejectFriendRequest = asyncHandler(async (req, res) => {

    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
        res.status(404);
        throw new Error(
            "Friend request not found"
        );
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    if (request.status === "accepted") {
        res.status(400);
        throw new Error("Already friends with the user, cannot reject request");
    }

    await request.deleteOne();

    res.status(200).json({
        success: true,
        message:
            "Friend request rejected"
    });
});


const getFriends = asyncHandler(async (req, res) => {

    const friendships =
        await FriendRequest.find({
            status: "accepted",
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        })
            .populate(
                "sender receiver",
                "username fullName college profilePic bio"
            );

    const friends = friendships.map(friendship => {

        if (
            friendship.sender._id.toString() ===
            req.user._id.toString()
        ) {
            return friendship.receiver;
        }

        return friendship.sender;
    });

    res.status(200).json({
        success: true,
        count: friends.length,
        friends
    });
});


const getSentRequests =
    asyncHandler(async (req, res) => {

        const requests =
            await FriendRequest.find({
                sender: req.user._id,
                status: "pending"
            }).populate(
                "receiver",
                "username fullName college profilePic bio"
            );

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    });


const cancelFriendRequest =
    asyncHandler(async (req, res) => {

        const request =
            await FriendRequest.findById(
                req.params.requestId
            );

        if (!request) {
            res.status(404);
            throw new Error(
                "Friend request not found"
            );
        }

        if (
            request.sender.toString() !==
            req.user._id.toString()
        ) {
            res.status(403);
            throw new Error("Not authorized");
        }

        if (request.status === "accepted") {
            res.status(400);
            throw new Error("Already friends with the user, cannot cancel request");
        }

        await request.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Friend request cancelled"
        });
    });



const unfriend = asyncHandler(async (req, res) => {

    const friendId = req.params.userId;

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

        res.status(404);
        throw new Error(
            "Friendship not found"
        );
    }

    await friendship.deleteOne();

    res.status(200).json({
        success: true,
        message: "Unfriended successfully"
    });
});



module.exports = {
    sendFriendRequest,
    getReceivedRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getSentRequests,
    cancelFriendRequest,
    unfriend
};