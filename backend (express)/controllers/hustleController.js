const asyncHandler = require("express-async-handler");
const Hustle = require("../models/hustleModel");
const HustleApplication = require("../models/hustleApplicationModel");
const createNotification = require("../utils/createNotification");

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

    await createNotification({
        receiver: hustle.createdBy,
        sender: req.user._id,
        type: "hustle_application",
        title: "New Application",
        body: `${req.user.fullName} applied to your hustle.`,
        referenceId: application._id,
        referenceType: "Application"
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


const acceptApplication = asyncHandler(async (req, res) => {

    const application = await HustleApplication.findById(req.params.applicationId);

    if (!application) {
        res.status(404);
        throw new Error("Application not found");
    }

    const hustle = await Hustle.findById(application.hustle);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    // Ownership Check
    if (
        hustle.createdBy.toString() !==
        req.user._id.toString()
    ) {
        res.status(403);
        throw new Error("Not authorized");
    }

    // Already Assigned
    if (hustle.status === "assigned") {
        res.status(400);
        throw new Error(
            "A candidate has already been selected"
        );
    }

    // Accept Application
    application.status = "accepted";

    await application.save();

    // Update Hustle Status
    hustle.status = "assigned";

    await hustle.save();

    await createNotification({
        receiver: application.applicant,
        sender: req.user._id,
        type: "application_accepted",
        title: "Application Accepted",
        body: `Your application has been accepted.`,
        referenceId: application._id,
        referenceType: "Application"
    });

    await HustleApplication.updateMany(
        {
            hustle: hustle._id,
            _id: { $ne: application._id }
        },
        {
            status: "rejected"
        });

    res.status(200).json({
        success: true,
        message: "Applicant accepted"
    });
});


const rejectApplication = asyncHandler(async (req, res) => {

    const application =
        await HustleApplication.findById(req.params.applicationId);

    if (!application) {
        res.status(404);
        throw new Error("Application not found");
    }

    const hustle = await Hustle.findById(application.hustle);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (
        hustle.createdBy.toString() !==
        req.user._id.toString()
    ) {
        res.status(403);
        throw new Error("Not authorized");
    }

    application.status = "rejected";

    await application.save();

    await createNotification({
        receiver: application.applicant,
        sender: req.user._id,
        type: "application_rejected",
        title: "Application Rejected",
        body: `Your application has been rejected.`,
        referenceId: application._id,
        referenceType: "Application"
    });

    res.status(200).json({
        success: true,
        message: "Application rejected"
    });
});


const getMyApplications = asyncHandler(async (req, res) => {

    const applications =
        await HustleApplication.find({
            applicant: req.user._id
        })
            .populate(
                "hustle",
                "title reward deadline status"
            )
            .sort({ createdAt: -1 });

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
    getHustleApplicants,
    acceptApplication,
    rejectApplication,
    getMyApplications
};