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
router.put("/:notificationId", protect, markNotificationRead);

router.put("/read-all", protect, markAllNotificationsRead);
router.delete("/:notificationId", protect, deleteNotification);
router.delete("/delete-all", protect, deleteAllNotifications);

module.exports = router;