const { Pinecone } = require("@pinecone-database/pinecone");
require("dotenv").config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const createIndex = async () => {
    const indexName = process.env.PINECONE_INDEX_NAME;

    const existingIndexes = await pc.indexes.list();

    const alreadyExists = existingIndexes.indexes?.some(
        (index) => index.name === indexName
    );

    if (alreadyExists) {
        console.log(`Index already exists.`);
        return;
    }

    const indexModel = await pc.indexes.create({
        name: indexName,

        schema: {
            fields: {
                _values: {
                    type: "dense_vector",
                    dimension: 1024,
                    metric: "cosine"
                }
            }
        },

        deployment: {
            deploymentType: "managed",
            cloud: "aws",
            region: "us-east-1"
        },

        waitUntilReady: true
    });

    console.log("Pinecone index created successfully.");
    console.log("Host:", indexModel.host);
};

createIndex().catch((error) => {
    console.error("Failed to create Pinecone index:");
    console.error(error);
});