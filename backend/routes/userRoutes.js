const express = require("express");
const router = express.Router();

const {
    protect
} = require("../middleware/authMiddleware");

const {
    searchUsers
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


router.get("/search", protect, searchUsers); //ok
router.post("/request/:userId", protect, sendFriendRequest);//ok
router.get("/requests/received", protect, getReceivedRequests);//ok
router.get("/requests/sent", protect, getSentRequests);//ok
router.put("/requests/:requestId/accept", protect, acceptFriendRequest);//ok
router.delete("/requests/:requestId/reject", protect, rejectFriendRequest);//ok
router.delete("/requests/:requestId/cancel", protect, cancelFriendRequest);//ok
router.get("/friends", protect, getFriends);//ok
router.delete("/friends/:userId/unfriend", protect, unfriend);//ok

module.exports = router;

//http://localhost:5000/api/users