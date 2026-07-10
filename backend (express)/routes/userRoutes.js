const express = require("express");
const router = express.Router();
const upload=require("../middleware/uploadMiddleware");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    searchUsers,
    uploadProfilePicture
} = require("../controllers/userController");


const {
    sendFriendRequest,
    getReceivedRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getSentRequests,
    cancelFriendRequest,
    unfriend
} = require("../controllers/friendController");


router.get("/search", protect, searchUsers);  
router.post("/request/:userId", protect, sendFriendRequest); 
router.get("/requests/received", protect, getReceivedRequests); 
router.get("/requests/sent", protect, getSentRequests); 
router.put("/requests/:requestId/accept", protect, acceptFriendRequest); 
router.delete("/requests/:requestId/reject", protect, rejectFriendRequest); 
router.delete("/requests/:requestId/cancel", protect, cancelFriendRequest); 
router.get("/friends", protect, getFriends); 
router.delete("/friends/:userId/unfriend", protect, unfriend); 
router.put("/profile-picture-upload", protect, upload.single("image"), uploadProfilePicture);

module.exports = router;