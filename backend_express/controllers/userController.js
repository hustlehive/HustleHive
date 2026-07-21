const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");
const cloudinary = require("../config/cloudinary");
const Hustle = require("../models/hustleModel");
const bcrypt = require("bcryptjs");
const searchUsers = asyncHandler(async (req, res) => {

    const username = req.query.username;

    if (!username) {
        res.status(400);
        throw new Error("Username query required");
    }

    const users = await User.find({
        $and: [
            {
                $or: [
                    {
                        username: {
                            $regex: username,
                            $options: "i"
                        }
                    },
                    {
                        fullName: {
                            $regex: username,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: username,
                            $options: "i"
                        }
                    },
                ]
            },
            {
                email: {
                    $ne: req.user.email
                }
            },
            {
                isDeleted: false
            },
        ]
    })
        .select("username fullName college profilePic bio");

    const userIds = users.map(user => user._id);

    const relationships =
        await FriendRequest.find({
            $or: [
                {
                    sender: req.user._id,
                    receiver: { $in: userIds }
                },
                {
                    receiver: req.user._id,
                    sender: { $in: userIds }
                }
            ]
        });

    const relationshipMap = {};

    relationships.forEach(rel => {

        let otherUserId;

        if (
            rel.sender.toString() ===
            req.user._id.toString()
        ) {

            otherUserId =
                rel.receiver.toString();

            if (rel.status === "pending") {

                relationshipMap[
                    otherUserId
                ] = "pending_sent";

            } else if (
                rel.status === "accepted"
            ) {

                relationshipMap[
                    otherUserId
                ] = "friend";
            }

        } else {

            otherUserId =
                rel.sender.toString();

            if (rel.status === "pending") {

                relationshipMap[
                    otherUserId
                ] = "pending_received";

            } else if (
                rel.status === "accepted"
            ) {

                relationshipMap[
                    otherUserId
                ] = "friend";
            }
        }
    });

    const usersWithStatus =
        users.map(user => {

            return {
                ...user.toObject(),

                relationshipStatus:
                    relationshipMap[
                    user._id.toString()
                    ] || "none"
            };
        });

    res.status(200).json({
        success: true,
        count: usersWithStatus.length,
        users: usersWithStatus
    });
});


const uploadProfilePicture = asyncHandler(async (req, res) => {

    if (!req.file) {
        res.status(400);
        throw new Error("Image is required");
    }
    console.log(req.file);
    console.log(req.user);

    if (req.user.profilePic.publicId) {
        await cloudinary.uploader.destroy(
            req.user.profilePic.publicId
        );
    }

    req.user.profilePic = {
        url: req.file.path,
        publicId: req.file.filename
    };

    await req.user.save();

    res.status(200).json({
        success: true,
        profilePic: req.user.profilePic
    });

});

const deleteProfilePicture = asyncHandler(async (req, res) => {

    if (!req.user.profilePic.publicId) {
        res.status(400);
        throw new Error("No profile picture found to delete");
    }

    await cloudinary.uploader.destroy(
        req.user.profilePic.publicId
    );

    req.user.profilePic = {
        url: "",
        publicId: ""
    };

    await req.user.save();

    res.status(200).json({
        success: true,
        message: "Profile picture deleted"
    });

});

const updateProfile = asyncHandler(async (req, res) => {

    const { fullName, bio } = req.body;

    if (fullName) {
        req.user.fullName = fullName;
    }

    if (bio !== undefined) {
        req.user.bio = bio;
    }

    await req.user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.status(200).json({
        success: true,
        user: updatedUser
    });

});


const getMyProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
        success: true,
        user
    });

});

const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.isDeleted) {
        res.status(404);
        throw new Error("User not found");
    }

    const response = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        college: user.college,
        bio: user.bio,
        profilePic: user.profilePic
    };

    res.status(200).json({
        success: true,
        user: response
    });

});

const getUserHustles = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const hustles = await Hustle.find({
        createdBy: user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: hustles.length,
        hustles
    });

});

const getUserFriends = asyncHandler(async (req, res) => {

    const targetUser = req.params.userId;

    const exists = await User.findById(targetUser);

    if (!exists) {
        res.status(404);
        throw new Error("User not found");
    }

    if (req.user._id.toString() !== targetUser) {

        const friendship = await FriendRequest.findOne({
            status: "accepted",
            $or: [
                {
                    sender: req.user._id,
                    receiver: targetUser
                },
                {
                    sender: targetUser,
                    receiver: req.user._id
                }
            ]
        });

        if (!friendship) {
            res.status(403);
            throw new Error("Not authorized");
        }

    }

    const friendships = await FriendRequest.find({
        status: "accepted",
        $or: [
            { sender: targetUser },
            { receiver: targetUser }
        ]
    })
        .populate("sender", "username fullName college profilePic")
        .populate("receiver", "username fullName college profilePic");

    const friends = friendships.map(friendship => {

        if (friendship.sender._id.toString() === targetUser) {

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


const softDeleteMyAccount = asyncHandler(async (req, res) => {

    const { password } = req.body;

    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }

    const isMatch = await bcrypt.compare(
        password,
        req.user.password
    );

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid password");
    }

    // Delete profile picture
    if (req.user.profilePic.publicId) {
        await cloudinary.uploader.destroy(
            req.user.profilePic.publicId
        );
    }

    // Delete hustle images
    const hustles = await Hustle.find({
        createdBy: req.user._id
    });

    for (const hustle of hustles) {
        if (hustle.photo.publicId) {
            await cloudinary.uploader.destroy(
                hustle.photo.publicId
            );
        }
    }

    // Delete user-owned data
    await Hustle.deleteMany({
        createdBy: req.user._id
    });

    await Application.deleteMany({
        $or: [
            { applicant: req.user._id },
            { acceptedApplicant: req.user._id }
        ]
    });

    await FriendRequest.deleteMany({
        $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
        ]
    });

    await Notification.deleteMany({
        $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
        ]
    });

    req.user.isDeleted = true;
    req.user.deletedAt = new Date();

    req.user.username = `deleted account`;
    req.user.fullName = "Deleted Account";
    req.user.email = `deleted account`;
    req.user.password = "";
    req.user.college = "";
    req.user.profilePic = {
        url: "",
        publicId: ""
    };
    req.user.bio = "";

    req.user.profilePic = {
        url: "",
        publicId: ""
    };

    await req.user.save();

    res.status(200).json({
        success: true,
        message: "Account deleted successfully"
    });

});


const changeUsername = asyncHandler(async (req, res) => {

    const { username } = req.body;

    if (!username) {
        res.status(400);
        throw new Error("Username is required");
    }

    if (username === req.user.username) {
        res.status(400);
        throw new Error("New username must be different");
    }

    const exists = await User.findOne({
        username: username.toLowerCase()
    });

    if (exists) {
        res.status(400);
        throw new Error("Username already taken");
    }

    if (req.user.usernameLastChangedAt) {

        const nextAllowed =
            new Date(req.user.usernameLastChangedAt);

        nextAllowed.setDate(
            nextAllowed.getDate() + 15
        );

        if (new Date() < nextAllowed) {

            res.status(400);
            throw new Error(
                `You can change your username after ${nextAllowed.toDateString()}`
            );

        }

    }

    req.user.username = username.toLowerCase();
    req.user.usernameLastChangedAt = new Date();

    await req.user.save();

    res.status(200).json({
        success: true,
        username: req.user.username,
        message: "Username updated successfully"
    });

});


module.exports = {
    searchUsers,
    uploadProfilePicture,
    deleteProfilePicture,
    updateProfile,
    getMyProfile,
    getUserProfile,
    getUserHustles,
    getUserFriends,
    softDeleteMyAccount,
    changeUsername
};