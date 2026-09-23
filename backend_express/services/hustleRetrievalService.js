const index = require("./pineconeService");
const generateEmbedding = require("./embeddingService");
const Hustle = require("../models/hustleModel");

const retrieveRelevantHustles = async (query, topK = 5) => {

    // 1. Convert the user's question into an embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Pinecone
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

    // 3. Extract IDs and similarity scores
    const matches = results.matches.map(match => ({
        hustleId: match.id,
        score: match.score
    }));

    if (matches.length === 0) {
        return [];
    }

    // 4. Fetch actual hustle documents from MongoDB
    const hustleIds = matches.map(
        match => match.hustleId
    );

    const hustles = await Hustle.find({
        _id: {
            $in: hustleIds
        },
        isDeletedByAdmin: false
    });

    // 5. Create a lookup map
    const hustleMap = new Map(
        hustles.map(hustle => [
            hustle._id.toString(),
            hustle
        ])
    );

    // 6. Preserve Pinecone ranking
    return matches
        .map(match => ({
            hustle: hustleMap.get(match.hustleId),
            score: match.score
        }))
        .filter(result => result.hustle);
};

module.exports = retrieveRelevantHustles;