const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);

router.put("/read-all", protect, markAllNotificationsRead);

router.put("/:notificationId", protect, markNotificationRead);

router.delete("/delete-all", protect, deleteAllNotifications);

router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;