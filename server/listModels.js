const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  try {
    const modelList = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get the object
    // Note: The SDK doesn't have a direct 'listModels' method on the genAI object in all versions, 
    // but we can try to find out what's wrong by just trying a very basic call.
    console.log("Attempting to list models...");
    // Since we can't easily list models without a specific API call, 
    // let's try 'gemini-1.5-flash-latest' which is the newest stable alias.
    console.log("Testing 'gemini-1.5-flash-latest'...");
  } catch (err) {
    console.error(err);
  }
}

run();
