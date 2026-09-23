const index = require("./pineconeService");
const generateEmbedding = require("./embeddingService");
const Hustle = require("../models/hustleModel");

const searchHustles = async (query, topK = 10) => {

    // 1. Convert user's search query into an embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Pinecone for semantically similar hustles
    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,

        filter: {
            isDeletedByAdmin: {
                $eq: false
            }
        }
    });

    console.log("PINECONE RESULTS:");
    console.dir(results, { depth: null });

    // 3. Extract MongoDB Hustle IDs
    const hustleIds = results.matches.map(
        match => match.id
    );

    if (hustleIds.length === 0) {
        return [];
    }

    // 4. Fetch the actual Hustle documents
    const hustles = await Hustle.find({
        _id: {
            $in: hustleIds
        },
        isDeletedByAdmin: false
    });

    // 5. Preserve Pinecone's similarity ranking
    const hustleMap = new Map(
        hustles.map(hustle => [
            hustle._id.toString(),
            hustle
        ])
    );

    return hustleIds
        .map(id => hustleMap.get(id))
        .filter(Boolean);
};

module.exports = searchHustles;