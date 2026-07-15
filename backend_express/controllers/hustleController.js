const asyncHandler = require("express-async-handler");
const Hustle = require("../models/hustleModel");
const HustleApplication = require("../models/hustleApplicationModel");
const createNotification = require("../utils/createNotification");
const cloudinary=require("../config/cloudinary");

const createHustle = asyncHandler(async (req, res) => {

    let photo = {
        url: "",
        publicId: ""
    };

    if (req.file) {
        console.log(req.file);
        photo = {
            url: req.file.path,
            publicId: req.file.filename
        };

    }

    try {
        const {
            title,
            description,
            reward,
            deadline
        } = req.body;


        // Validate Fields
        if (
            !title ||
            !description ||
            !reward ||
            !deadline
        ) {
            if (photo.publicId) {
                console.log(photo);
                const imageDeleteResult = await cloudinary.uploader.destroy(photo.publicId);
                console.log(imageDeleteResult);
            }

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
            photo,
            college: req.user.college,
            createdBy: req.user._id
        });

        res.status(200).json({
            success: true,
            hustle
        });
    } catch (e) {
        if (photo.publicId) {
            console.log(photo);
            const imageDeleteResult = await cloudinary.uploader.destroy(photo.publicId);
            console.log(imageDeleteResult);

            res.status(500);
            throw new Error("Unexpected error occured, please ensure all fields are valid.");
        }
    }


});


const getHustles = asyncHandler(async (req, res) => {
    const {
        college,
        minReward,
        maxReward,
        status,
        search,
        sort,
        page = 1,
        limit = 10
    } = req.query;

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

    // Search
    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Sorting
    let sortOption = {
        createdAt: -1
    };

    switch (sort) {
        case "oldest":
            sortOption = { createdAt: 1 };
            break;
        case "reward-asc":
            sortOption = { reward: 1 };
            break;
        case "reward-desc":
            sortOption = { reward: -1 };
            break;
        case "deadline":
            sortOption = { deadline: 1 };
            break;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Hustle.countDocuments(filter);

    const hustles = await Hustle.find(filter)
        .populate(
            "createdBy",
            "username fullName college"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    res.status(200).json({
        success: true,
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
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

const uploadHustleImage = asyncHandler(async (req, res) => {

    const hustle = await Hustle.findById(req.params.hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (hustle.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    if (!req.file) {
        res.status(400);
        throw new Error("Image is required");
    }

    if (hustle.photo.publicId) {
        await cloudinary.uploader.destroy(
            hustle.photo.publicId
        );
    }

    hustle.photo = {
        url: req.file.path,
        publicId: req.file.filename
    };

    await hustle.save();

    res.status(200).json({
        success: true,
        photo: hustle.photo
    });

});


const deleteHustleImage = asyncHandler(async (req, res) => {

    const hustle = await Hustle.findById(req.params.hustleId);

    if (!hustle) {
        res.status(404);
        throw new Error("Hustle not found");
    }

    if (hustle.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    if (!hustle.photo.publicId) {
        res.status(400);
        throw new Error("No image found");
    }

    await cloudinary.uploader.destroy(
        hustle.photo.publicId
    );

    hustle.photo = {
        url: "",
        publicId: ""
    };

    await hustle.save();

    res.status(200).json({
        success: true,
        message: "Hustle image deleted"
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
    getMyApplications,
    uploadHustleImage,
    deleteHustleImage
};