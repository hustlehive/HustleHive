const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    startConversation,
    sendMessage,
    getInbox,
    getMessages,
    markConversationAsRead
} = require("../controllers/messageController");

router.post("/start", protect, startConversation);
router.post("/send", protect, sendMessage);

router.get("/inbox", protect, getInbox);
router.get("/:conversationId", protect, getMessages);

router.put("/read/:conversationId", protect, markConversationAsRead);

router.put("/edit/:messageId", protect, editMessage);

router.delete("/delete/:messageId", protect, deleteMessageForEveryone);

module.exports = router;