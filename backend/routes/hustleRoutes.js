const express = require("express");
const router = express.Router();
const {
    createHustle,
    getHustles,
    getHustleById,
    updateHustle,
    deleteHustle,
    applyToHustle,
    getHustleApplicants
} = require("../controllers/hustleController");

const {
    protect
} = require("../middleware/authMiddleware");


router.post("/create", protect, createHustle);
router.get("/", protect, getHustles);
router.get("/:id", protect, getHustleById);
router.put("/:id", protect, updateHustle);
router.delete("/:id", protect, deleteHustle);
router.post("/:id/apply", protect, applyToHustle);
router.get("/:id/applicants", protect, getHustleApplicants);

module.exports = router;