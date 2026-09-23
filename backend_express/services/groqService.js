const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API
});

const improveHustle = async ({ title, description }) => {

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
            {
                role: "system",
                content: `
You are an AI writing assistant for HustleHive.

HustleHive is a student networking and freelance marketplace.

Improve the student's hustle title and description.

Rules:
- Keep the original intent unchanged.
- Make the title clear, concise and professional.
- Make the description clear, specific and attractive.
- Do not invent requirements.
- Do not invent reward, deadline, college or any other factual information.
- Do not add information that was not provided by the student.
`
            },
            {
                role: "user",
                content: `
Improve this HustleHive hustle.

Title:
${title}

Description:
${description}
`
            }
        ],

        response_format: {
            type: "json_schema",
            json_schema: {
                name: "improved_hustle",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        }
                    },
                    required: ["title", "description"],
                    additionalProperties: false
                }
            }
        }
    });

    return JSON.parse(response.choices[0].message.content);
};

module.exports = improveHustle;