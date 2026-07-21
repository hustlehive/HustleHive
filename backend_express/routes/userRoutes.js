const express = require("express");
const router = express.Router();
const uploadProfileImage=require("../middleware/uploadProfileImage");
const {
    protect
} = require("../middleware/authMiddleware");

const {
    searchUsers,
    uploadProfilePicture,
    deleteProfilePicture,
    updateProfile,
    getMyProfile,
    getUserProfile,
    getUserHustles,
    getUserFriends,
    softDeleteMyAccount,
    changeUsername
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
router.put("/profile-picture", protect, uploadProfileImage.single("image"), uploadProfilePicture);
router.delete("/profile-picture", protect, deleteProfilePicture);
router.put("/profile", protect, updateProfile);
router.get("/me", protect, getMyProfile);
router.get("/:userId/hustles", protect, getUserHustles);
router.get("/:userId/friends", protect, getUserFriends);
router.get("/:userId", protect, getUserProfile);
router.put("/username", protect, changeUsername);


router.delete("/me", protect, softDeleteMyAccount);

module.exports = router;