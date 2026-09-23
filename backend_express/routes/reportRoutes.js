const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {

    reportUser,

    reportHustle

} = require("../controllers/reportController");

router.post("/user/:userId", protect, reportUser);
router.post("/hustle/:hustleId", protect, reportHustle);

module.exports = router;