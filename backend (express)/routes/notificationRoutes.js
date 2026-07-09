const express=require("express");
const router=express.Router();

const {protect}=require("../middleware/authMiddleware");

const{
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
}=require("../controllers/notificationController");

router.get("/",protect,getNotifications);
router.put("/:notificationId",  protect,  markNotificationRead);

router.put("/read-all",  protect,  markAllNotificationsRead);

module.exports=router;