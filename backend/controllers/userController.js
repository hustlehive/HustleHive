const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

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
        email: {$ne: req.user.email}
    })
        .select(
            "username fullName college profilePic"
        );

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

module.exports = {
    searchUsers
};