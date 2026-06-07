const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

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

module.exports = {
    searchUsers
};