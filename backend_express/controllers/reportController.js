const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Hustle = require("../models/hustleModel");
const Report = require("../models/reportModel");
const Application = require("../models/hustleApplicationModel");

const AUTO_BAN_THRESHOLD = 2;

const reportUser = asyncHandler(async (req, res) => {

    const {
        reason,
        description = ""
    } = req.body;

    const { userId } = req.params;

    if (!reason) {
        res.status(400);
        throw new Error("Reason is required");
    }

    if (
        reason === "Other" &&
        !description.trim()
    ) {
        res.status(400);
        throw new Error(
            "Description is required when reason is Other"
        );
    }

    if (userId === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot report yourself");
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.isDeleted) {
        res.status(400);
        throw new Error("Cannot report deleted account");
    }

    if (user.isBanned) {
        res.status(400);
        throw new Error("User already banned");
    }

    if (user.role == "admin") {
        res.status(400);
        throw new Error("Unable to report, try again later.");
    }

    const exists = await Report.findOne({

        reportType: "user",
        reportedUser: userId,
        reportedBy: req.user._id,
        status: "pending"
    });

    if (exists) {
        res.status(400);
        throw new Error("You have already reported this user");
    }

    await Report.create({
        reportType: "user",
        reportedUser: userId,
        reportedBy: req.user._id,
        reason,
        description
    });

    const reportCount = await Report.countDocuments({
        reportType: "user",
        reportedUser: userId,
        status: "pending"
    });

    if (reportCount >= AUTO_BAN_THRESHOLD) {

        user.isBanned = true;
        await user.save();

        await Report.updateMany(
            {
                reportType: "user",
                reportedUser: user._id,
                status: "pending"
            },
            {
                status: "resolved"
            }
        );

    }

    res.status(201).json({
        success: true,
        reportCount,
        message: "User reported successfully"

    });

});


const reportHustle = asyncHandler(async (req, res) => {

    const { hustleId } = req.params;
    const {
        reason,
        description = ""
    } = req.body;

    if (!reason) {
        res.status(400);
        throw new Error("Reason is required");
    }

    if (
        reason === "Other" &&
        !description.trim()
    ) {
        res.status(400);
        throw new Error(
            "Description is required when reason is Other"
        );
    }

    const hustle = await Hustle.findById(hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (hustle.createdBy.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot report your own hustle");
    }

    const exists = await Report.findOne({

        reportType: "hustle",
        reportedHustle: hustleId,
        reportedBy: req.user._id,
        status: "pending"
    });

    if (exists) {
        res.status(400);
        throw new Error("You already reported this hustle");
    }

    await Report.create({
        reportType: "hustle",
        reportedHustle: hustleId,
        reportedBy: req.user._id,
        reason,
        description
    });

    const reportCount = await Report.countDocuments({
        reportType: "user",
        reportedUser: userId,
        status: "pending"
    });

    if (reportCount >= AUTO_BAN_THRESHOLD) {

        await Application.deleteMany({
            hustle: hustleId
        });

        hustle.isDeletedByAdmin = true;
        hustle.deletedByAdminAt = new Date();

        await hustle.save();

        await Report.updateMany(
            {
                reportType: "hustle",
                reportedHustle: hustleId,
                status: "pending"
            },
            {
                status: "resolved"
            }
        );
    }

    res.status(201).json({
        success: true,
        reportCount,
        message: "Hustle reported successfully"
    });

});


module.exports = {
    reportUser,
    reportHustle
};