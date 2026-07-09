const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        receiver: req.user._id
    })
        .populate(
            "sender",
            "username fullName profilePic"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: notifications.length,
        notifications
    });

});

const markNotificationRead = asyncHandler(async (req, res) => {

    const notification = await Notification.findById(
        req.params.notificationId
    );

    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }

    if (
        notification.receiver.toString() !==
        req.user._id.toString()
    ) {
        res.status(403);
        throw new Error("Not authorized");
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
        success: true,
        message: "Notification marked as read"
    });

});

const markAllNotificationsRead =
    asyncHandler(async (req, res) => {

        await Notification.updateMany(
            {
                receiver: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    });

module.exports = {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
};