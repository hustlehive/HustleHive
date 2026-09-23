const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const generateEmbedding = async (text) => {

    const response = await pc.inference.embed({
        model: "multilingual-e5-large",

        inputs: [text],

        parameters: {
            inputType: "passage",
            truncate: "END"
        }
    });

    const embedding = response.data[0];

    if (embedding.vectorType !== "dense") {
        throw new Error(
            `Expected dense embedding, received ${embedding.vectorType}`
        );
    }

    return embedding.values;
};

module.exports = generateEmbedding;