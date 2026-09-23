const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    improveHustleWithAI,
    askHustleHiveController
} = require("../controllers/aiController");

const router = express.Router();

router.post("/improve-hustle", protect, improveHustleWithAI);
router.post("/ask", protect, askHustleHiveController);

module.exports = router;