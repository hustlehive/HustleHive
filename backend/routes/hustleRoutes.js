const express = require("express");
const router = express.Router();
const {
    createHustle
} = require("../controllers/hustleController");

const {
    protect
} = require("../middleware/authMiddleware");


router.post("/", protect, createHustle);

module.exports = router;