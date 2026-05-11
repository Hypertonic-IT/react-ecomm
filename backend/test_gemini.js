const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Note: listModels is on the client in the REST API, but in the Node SDK 
// it might be different or not exposed directly in a simple way.
// Let's try the direct fetch to the API.

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

getModels();
