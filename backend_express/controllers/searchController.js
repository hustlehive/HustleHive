const asyncHandler = require("express-async-handler");
const searchHustles = require("../services/hustleSearchService");

const searchHustlesController = asyncHandler(async (req, res) => {

    const { q } = req.query;

    if (!q || !q.trim()) {
        res.status(400);
        throw new Error("Search query is required");
    }

    const hustles = await searchHustles(q.trim());

    res.status(200).json({
        success: true,
        count: hustles.length,
        hustles
    });
});

module.exports = {
    searchHustlesController
};