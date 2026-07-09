const express = require("express");

const router = express.Router();

const {
    protect
} = require("../middleware/authMiddleware");

const {

    sendMessage,
    getMessages,
    getInbox,
    markConversationAsRead

} = require("../controllers/friendMessageController");


router.post("/:friendId", protect, sendMessage);
router.get("/inbox", protect, getInbox);
router.get("/:friendId", protect, getMessages);
router.put("/read/:conversationId", protect, markConversationAsRead);


module.exports = router;