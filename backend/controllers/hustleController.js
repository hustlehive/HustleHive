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

module.exports = {
    createHustle
};