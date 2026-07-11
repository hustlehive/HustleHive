const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");
const cloudinary = require("../config/cloudinary");

const searchUsers = asyncHandler(async (req, res) => {

    const username = req.query.username;

    if (!username) {
        res.status(400);
        throw new Error("Username query required");
    }

    const users = await User.find({
        username: {
            $regex: username,
            $options: "i"
        },
        email: { $ne: req.user.email }
    })
        .select(
            "username fullName college profilePic bio"
        );

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

module.exports = {
    searchUsers,
    uploadProfilePicture,
    deleteProfilePicture,
    updateProfile,
    getMyProfile
};