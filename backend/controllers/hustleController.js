const asyncHandler = require("express-async-handler");
const Hustle = require("../models/hustleModel");

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

module.exports = {
    createHustle,
    getHustles
};