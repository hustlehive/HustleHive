const express=require("express");

const router=express.Router();

const {protect}=require("../middleware/authMiddleware");
const {admin}=require("../middleware/adminMiddleware");

const{
    getDashboard,
    getUsers,
    getUser,
    deleteUser,
    getHustles,
    deleteHustle,
    getApplications
}=require("../controllers/adminController");

router.get("/dashboard", protect, admin, getDashboard);
router.get("/users", protect, admin, getUsers);
router.get("/users/:userId", protect, admin, getUser);
router.delete("/users/:userId", protect, admin, deleteUser);
router.get("/hustles", protect, admin, getHustles);
router.delete("/hustles/:hustleId", protect, admin, deleteHustle);
router.get("/applications", protect, admin, getApplications);

module.exports=router;