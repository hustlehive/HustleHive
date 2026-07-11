const Notification = require("../models/notificationModel");
const { emitNotification } = require("../socket/socketEvents");

const createNotification = async ({
    receiver,
    sender = null,
    type,
    title,
    body,
    referenceId = null,
    referenceType = null
}) => {

    const notification = await Notification.create({
        receiver,
        sender,
        type,
        title,
        body,
        referenceId,
        referenceType
    });

    await notification.populate(
        "sender",
        "username fullName profilePic"
    );

    const unreadCount = await Notification.countDocuments({
        receiver,
        isRead: false
    });

    emitNotification(
        receiver,
        {
            notification,
            unreadCount
        }
    );

    return notification;
};

module.exports = createNotification;