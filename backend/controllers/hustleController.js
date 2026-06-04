const asyncHandler = require("express-async-handler");
const Hustle = require("../models/hustleModel");
const HustleApplication = require("../models/hustleApplicationModel");

const createHustle = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        reward,
        photo,
        deadline
    } = req.body;


    // Validate Fields
    if (
        !title ||
        !description ||
        !reward ||
        !deadline
    ) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    // Create Hustle
    const hustle = await Hustle.create({
        title,
        description,
        reward,
        photo,
        deadline,
        college: req.user.college,
        createdBy: req.user._id
    });


    res.status(200).json({
        success: true,
        hustle
    });
});


const getHustles = asyncHandler(async (req, res) => {

    const {
        college,
        minReward,
        maxReward,
        status
    } = req.query;

    // Filter Object
    let filter = {};

    // College Filter
    if (college) {
        filter.college = college;
    }

    // Status Filter
    if (status) {
        filter.status = status;
    }

    // Reward Filter
    if (minReward || maxReward) {
        filter.reward = {};

        if (minReward) {
            filter.reward.$gte = Number(minReward);
        }

        if (maxReward) {
            filter.reward.$lte = Number(maxReward);
        }
    }

    // Fetch Hustles
    const hustles = await Hustle.find(filter)
        .populate("createdBy", "username fullName college")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: hustles.length,
        hustles
    });
});

const getHustleById = asyncHandler(async (req, res) => {

    const hustle = await Hustle.findById(req.params.id)
        .populate("createdBy", "username fullName college");

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    res.status(200).json({
        success: true,
        hustle
    });
});

const updateHustle = asyncHandler(async (req, res) => {
    const hustle = await Hustle.findById(req.params.id);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    // Ownership Check
    if (hustle.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this hustle");
    }

    // Update Fields
    hustle.title = req.body.title || hustle.title;

    hustle.description =
        req.body.description || hustle.description;

    hustle.reward =
        req.body.reward || hustle.reward;

    hustle.photo =
        req.body.photo || hustle.photo;

    hustle.deadline =
        req.body.deadline || hustle.deadline;

    hustle.status =
        req.body.status || hustle.status;

    const updatedHustle = await hustle.save();

    res.status(200).json({
        success: true,
        hustle: updatedHustle
    });
});

const deleteHustle = asyncHandler(async (req, res) => {
    const hustle = await Hustle.findById(req.params.id);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    // Ownership Check
    if (hustle.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this hustle");
    }

    await hustle.deleteOne();

    res.status(200).json({
        success: true,
        message: "Hustle deleted successfully"
    });
});

const applyToHustle = asyncHandler(async (req, res) => {

    const hustleId = req.params.id;

    // Find Hustle
    const hustle = await Hustle.findById(hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    // Prevent Applying To Own Hustle
    if (
        hustle.createdBy.toString() === req.user._id.toString()
    ) {
        res.status(400);
        throw new Error("You cannot apply to your own hustle");
    }

    // Check Existing Application
    const existingApplication =
        await HustleApplication.findOne({
            hustle: hustleId,
            applicant: req.user._id
        });

    if (existingApplication) {
        res.status(400);
        throw new Error("Already applied to this hustle");
    }

    // Create Application
    const application =
        await HustleApplication.create({
            hustle: hustleId,
            applicant: req.user._id
        });

    res.status(201).json({
        success: true,
        message: "Applied successfully",
        application
    });
});


const getHustleApplicants = asyncHandler(async (req, res) => {

    const hustle = await Hustle.findById(req.params.id);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    // Ownership Check
    if (
        hustle.createdBy.toString() !== req.user._id.toString()
    ) {
        res.status(403);
        throw new Error(
            "Not authorized to view applicants"
        );
    }

    // Fetch Applications
    const applications = await HustleApplication.find({
            hustle: req.params.id
        }).populate("applicant", "username fullName college").sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });
});


module.exports = {
    createHustle,
    getHustles,
    getHustleById,
    updateHustle,
    deleteHustle,
    applyToHustle,
    getHustleApplicants
};