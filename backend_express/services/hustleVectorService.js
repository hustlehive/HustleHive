const index = require("./pineconeService");
const generateEmbedding = require("./embeddingService");

const upsertHustleVector = async (hustle) => {

    const text = `${hustle.title}\n${hustle.description}`;

    const embedding = await generateEmbedding(text);

    await index.upsert({
        records: [
            {
                id: hustle._id.toString(),

                values: embedding,

                metadata: {
                    hustleId: hustle._id.toString(),
                    title: hustle.title,
                    description: hustle.description,
                    college: hustle.college,
                    status: hustle.status,
                    createdBy: hustle.createdBy,
                    isDeletedByAdmin: hustle.isDeletedByAdmin
                }
            }
        ]
    });
};


const deleteHustleVector = async (hustleId) => {

    await index.deleteOne({
        id: hustleId.toString()
    });

    console.log(
        `Deleted hustle vector from Pinecone: ${hustleId}`
    );
};


module.exports = {
    upsertHustleVector,
    deleteHustleVector
};