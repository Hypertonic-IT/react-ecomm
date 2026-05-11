const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listAllModels() {
  try {
    const models = await ai.models.list();
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    console.error("List Models Error:", error.message);
  }
}

listAllModels();
