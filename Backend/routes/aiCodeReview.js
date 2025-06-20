// aiCodeReview.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GoogleGenAI);

// Review code using Gemini
const aiCodeReview = async (code) => {
  if (!code || typeof code !== "string" || code.trim() === "") {
    throw new Error("No valid code provided for review.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You're an AI code reviewer. Analyze the following code and provide a clear, concise review with suggestions for improvement and potential bugs:

\`\`\`
${code}
\`\`\`
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const review = await response.text();

  return review;
};

module.exports = { aiCodeReview };
