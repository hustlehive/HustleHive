const Notification = require("../models/notificationModel");

const createNotification = async ({

    receiver,
    sender = null,
    type,
    title,
    body,
    referenceId = null,
    referenceType = null

}) => {

    return await Notification.create({

        receiver,
        sender,
        type,
        title,
        body,
        referenceId,
        referenceType

    });

};

module.exports = createNotification;