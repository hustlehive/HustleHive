const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Hustle = require("../models/hustleModel");
const Application = require("../models/hustleApplicationModel");
const FriendRequest = require("../models/friendRequestModel");
const cloudinary = require("../config/cloudinary");
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const Notification = require("../models/notificationModel");
const Report = require("../models/reportModel");


const getDashboard = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalHustles = await Hustle.countDocuments();

    const activeHustles = await Hustle.countDocuments({
        status: "open"
    });

    const completedHustles = await Hustle.countDocuments({
        status: "completed"
    });

    const totalApplications = await Application.countDocuments();

    const totalFriendships = await FriendRequest.countDocuments({
        status: "accepted"
    });

    res.status(200).json({
        success: true,
        dashboard: {
            totalUsers,
            totalHustles,
            activeHustles,
            completedHustles,
            totalApplications,
            totalFriendships
        }
    });

});


const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });

});


const getUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.userId)
        .select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        success: true,
        user
    });

});


const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.profilePic.publicId) {
        await cloudinary.uploader.destroy(
            user.profilePic.publicId
        );
    }

    const hustles = await Hustle.find({
        createdBy: user._id
    });

    for (const hustle of hustles) {
        if (hustle.photo.publicId) {
            await cloudinary.uploader.destroy(
                hustle.photo.publicId
            );
        }
    }

    await Hustle.deleteMany({
        createdBy: user._id
    });

    await Application.deleteMany({
        $or: [
            { applicant: user._id },
            { acceptedApplicant: user._id }
        ]
    });

    await FriendRequest.deleteMany({
        $or: [
            { sender: user._id },
            { receiver: user._id }
        ]
    });

    await Notification.deleteMany({
        $or: [
            { sender: user._id },
            { receiver: user._id }
        ]
    });

    // await Message.deleteMany({
    //     sender:user._id
    // });

    // await Conversation.deleteMany({
    //     participants:user._id
    // });

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });

});


const getHustles = asyncHandler(async (req, res) => {

    const hustles = await Hustle.find()
        .populate(
            "createdBy",
            "username fullName college"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: hustles.length,
        hustles
    });

});


const deleteHustle = asyncHandler(async (req, res) => {

    const hustle = await Hustle.findById(req.params.hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (hustle.photo.publicId) {
        await cloudinary.uploader.destroy(
            hustle.photo.publicId
        );
    }

    await Application.deleteMany({
        hustle: hustle._id
    });

    await Notification.deleteMany({
        referenceId: hustle._id
    });

    await hustle.deleteOne();

    res.status(200).json({
        success: true,
        message: "Hustle deleted successfully"
    });

});


const getApplications = asyncHandler(async (req, res) => {

    const applications = await Application.find()
        .populate(
            "applicant",
            "username fullName college"
        )
        .populate(
            "hustle",
            "title reward status"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });

});


const getReportedUsers = asyncHandler(async (req, res) => {

    const reports = await Report.aggregate([
        {
            $match: {
                reportType: "user",
                status: "pending"
            }
        },
        {
            $group: {
                _id: "$reportedUser",
                reportCount: {
                    $sum: 1
                },
                reports: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $sort: {
                reportCount: -1
            }
        }
    ]);

    const result = [];

    for (const item of reports) {

        const user = await User.findById(item._id)
            .select("fullName username email profilePic isBanned");

        if (!user)
            continue;

        await Report.populate(item.reports, [
            {
                path: "reportedBy",
                select: "fullName username profilePic"
            }
        ]);

        result.push({
            user,
            reportCount: item.reportCount,
            reports: item.reports
        });

    }

    res.status(200).json({
        success: true,
        count: result.length,
        users: result
    });

});


const getReportedHustles = asyncHandler(async (req, res) => {

    const reports = await Report.aggregate([
        {
            $match: {
                reportType: "hustle",
                status: "pending"
            }
        },
        {
            $group: {
                _id: "$reportedHustle",
                reportCount: {
                    $sum: 1
                },
                reports: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $sort: {
                reportCount: -1
            }
        }
    ]);

    const result = [];

    for (const item of reports) {

        const hustle = await Hustle.findById(item._id)
            .populate("createdBy", "username fullName profilePic");

        if (!hustle)
            continue;

        await Report.populate(item.reports, [
            {
                path: "reportedBy",
                select: "username fullName profilePic"
            }
        ]);

        result.push({
            hustle,
            reportCount: item.reportCount,
            reports: item.reports
        });

    }

    res.status(200).json({
        success: true,
        count: result.length,
        hustles: result
    });

});


const banUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.isBanned) {
        res.status(400);
        throw new Error("User already banned");
    }

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

    res.status(200).json({
        success: true,
        message: "User banned successfully"
    });

});


const unbanUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.isBanned = false;

    await user.save();

    res.status(200).json({
        success: true,
        message: "User unbanned successfully"
    });

});


const dismissUserReports = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    await Report.updateMany(
        {
            reportType: "user",
            reportedUser: userId,
            status: "pending"
        },
        {
            status: "dismissed"
        }
    );

    res.status(200).json({
        success: true,
        message: "Reports dismissed"
    });

});


const dismissHustleReports = asyncHandler(async (req, res) => {

    const { hustleId } = req.params;

    await Report.updateMany(
        {
            reportType: "hustle",
            reportedHustle: hustleId,
            status: "pending"
        },
        {
            status: "dismissed"
        }
    );

    res.status(200).json({
        success: true,
        message: "Reports dismissed"
    });

});


const deleteReportedHustle = asyncHandler(async (req, res) => {

    const { hustleId } = req.params;

    const hustle = await Hustle.findById(hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

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

    hustle.isDeletedByAdmin = true;
    hustle.deletedByAdminAt = new Date();

    await hustle.save();

    res.status(200).json({
        success: true,
        message: "Hustle deleted successfully"
    });

});


const restoreHustle = asyncHandler(async (req, res) => {

    const { hustleId } = req.params;

    const hustle = await Hustle.findById(hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (!hustle.isDeletedByAdmin) {
        res.status(400);
        throw new Error("Hustle is already active");
    }

    hustle.isDeletedByAdmin = false;
    hustle.deletedByAdminAt = null;

    await hustle.save();

    res.status(200).json({
        success: true,
        message: "Hustle restored successfully"
    });

});

const deleteReport = asyncHandler(async (req, res) => {

    const { reportId } = req.params;

    const report = await Report.findById(reportId);

    if (!report) {
        res.status(404);
        throw new Error("Report not found");
    }

    await report.deleteOne();

    res.status(200).json({
        success: true,
        message: "Report deleted successfully"
    });

});


module.exports = {
    getDashboard,
    getUsers,
    getUser,
    deleteUser,
    getHustles,
    deleteHustle,
    getApplications,
    getReportedUsers,
    getReportedHustles,
    banUser,
    unbanUser,
    dismissUserReports,
    dismissHustleReports,
    deleteReportedHustle,
    restoreHustle,
    deleteReport
};