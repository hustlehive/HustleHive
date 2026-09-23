const asyncHandler = require("express-async-handler");
const improveHustle = require("../services/groqService");
const generateEmbedding = require("../services/embeddingService");
const Hustle = require("../models/hustleModel");
const askHustleHive = require("../services/ragService");


const improveHustleWithAI = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error("Title and description are required");
    }

    const improvedHustle = await improveHustle({
        title,
        description
    });

    res.status(200).json({
        success: true,
        improvedHustle
    });
});

const askHustleHiveController = asyncHandler(async (req, res) => {

    const { question } = req.body;

    if (!question || !question.trim()) {
        res.status(400);
        throw new Error("Question is required");
    }

    const result = await askHustleHive(
        question.trim()
    );

    res.status(200).json({
        success: true,
        ...result
    });
});



module.exports = {
    improveHustleWithAI,
    askHustleHiveController
};