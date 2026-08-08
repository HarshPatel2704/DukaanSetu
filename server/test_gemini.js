const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in .env");
    return;
  }

  console.log("Using Key (first 6):", apiKey.substring(0, 6));
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    console.log(`Testing '${modelName}'...`);
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log(`SUCCESS with ${modelName}! Response:`, response.text());
  } catch (err) {
    console.error(`FAILURE with ${modelName}! Error:`, err.message);
  }
}

run();
