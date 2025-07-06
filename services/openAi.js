const { OpenAI } = require("openai");

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openAi;
