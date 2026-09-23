const index = require("./pineconeService");
const generateEmbedding = require("./embeddingService");
const Hustle = require("../models/hustleModel");

const retrieveRelevantHustles = async (
    query,
    userId,
    topK = 50,
    similarityThreshold = 0.65
) => {

    // 1. Convert user's question into an embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Pinecone
    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,

        filter: {
            isDeletedByAdmin: {
                $eq: false
            },
            createdBy: {
                $ne: userId.toString()
            }
        }
    });

    // 4. Extract IDs and similarity scores
    const matches = results.matches.map(match => ({
        hustleId: match.id,
        score: match.score
    }));

    if (matches.length === 0) {
        return [];
    }

    // 5. Fetch actual Hustle documents from MongoDB
    const hustleIds = matches.map(
        match => match.hustleId
    );

    const hustles = await Hustle.find({
        _id: {
            $in: hustleIds
        },
        createdBy: {
            $ne: userId.toString()
        },
        isDeletedByAdmin: false
    });

    // 6. Create lookup map
    const hustleMap = new Map(
        hustles.map(hustle => [
            hustle._id.toString(),
            hustle
        ])
    );

    // 7. Preserve Pinecone ranking + similarity score
    return matches
        .map(match => ({
            hustle: hustleMap.get(match.hustleId),
            score: match.score
        }))
        .filter(result => result.hustle);
};

module.exports = retrieveRelevantHustles;