const express = require("express");
const upload=require("../middleware/uploadHustleImage");
const router = express.Router();
const {
    createHustle,
    getHustles,
    getHustleById,
    updateHustle,
    deleteHustle,
    applyToHustle,
    getHustleApplicants,
    acceptApplication,
    rejectApplication,
    getMyApplications,
    uploadHustleImage,
    deleteHustleImage
} = require("../controllers/hustleController");

const {
    protect
} = require("../middleware/authMiddleware");


router.post("/", protect, upload.single("image"), createHustle);
router.get("/", protect, getHustles);
router.get("/:id", protect, getHustleById);
router.put("/:id", protect, updateHustle);
router.delete("/:id", protect, deleteHustle);
router.post("/:id/apply", protect, applyToHustle);
router.get("/:id/applicants", protect, getHustleApplicants);
router.put("/applications/:applicationId/accept", protect, acceptApplication);
router.put("/applications/:applicationId/reject", protect, rejectApplication);
router.get("/applications/my-applications", protect, getMyApplications);
router.put("/:hustleId/image", protect, upload.single("image"), uploadHustleImage);
router.delete("/:hustleId/image", protect, deleteHustleImage);

module.exports = router;