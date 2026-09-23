const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
    getDashboard,
    getUsers,
    getUser,
    deleteUser,
    getHustles,
    deleteHustle,
    getApplications,
    getReportedUsers,
    getReportedHustles,
    banUser,
    unbanUser,
    dismissUserReports,
    dismissHustleReports,
    deleteReportedHustle,
    restoreHustle,
    deleteReport
} = require("../controllers/adminController");

router.get("/dashboard", protect, admin, getDashboard);
router.get("/users", protect, admin, getUsers);
router.get("/users/:userId", protect, admin, getUser);
router.delete("/users/:userId", protect, admin, deleteUser);
router.get("/hustles", protect, admin, getHustles);
router.delete("/hustles/:hustleId", protect, admin, deleteHustle);
router.get("/applications", protect, admin, getApplications);
router.get("/reports/users", protect, admin, getReportedUsers);
router.get("/reports/hustles", protect, admin, getReportedHustles);
router.put("/users/:userId/ban", protect, admin, banUser);
router.put("/users/:userId/unban", protect, admin, unbanUser);
router.delete("/dismiss/users/:userId", protect, admin, dismissUserReports);
router.delete("/dismiss/hustles/:hustleId", protect, admin, dismissHustleReports);
router.delete("/hustles/:hustleId", protect, admin, deleteReportedHustle);
router.put("/hustles/:hustleId/restore", protect, admin, restoreHustle);
router.delete("/reports/:reportId", protect, admin, deleteReport);

module.exports = router;