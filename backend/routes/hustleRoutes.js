const express = require("express");
const router = express.Router();
const {
    createHustle,
    getHustles
} = require("../controllers/hustleController");

const {
    protect
} = require("../middleware/authMiddleware");


router.post("/", protect, createHustle);
router.get("/", protect, getHustles);

module.exports = router;