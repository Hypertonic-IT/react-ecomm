const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testImagen() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: "A professional studio shot of a high-quality cotton blue t-shirt on a white background",
      config: {
        numberOfImages: 1,
      },
    });
    console.log("Success! Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Imagen Test Error:", error.message);
  }
}

testImagen();
