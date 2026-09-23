const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    searchHustlesController
} = require("../controllers/searchController");

const router = express.Router();

router.get("/hustles", protect, searchHustlesController);

module.exports = router;