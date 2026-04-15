// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro-latest",
// });

// console.log(model);

// exports.processUserText = async (text) => {
//   const prompt = `
// You are a financial assistant.

// Convert the user input into STRICT JSON.

// Rules:
// - Only return JSON (no explanation)
// - Detect intent: add, query, delete
// - Extract:
//   type: expense/income/investment
//   amount: number
//   person: string
//   category: string
//   date: ISO format if possible
//   startDate & endDate for queries

// Examples:

// Input: "aaj jatin ko 2000 diye"
// Output:
// {
//   "intent": "add",
//   "type": "expense",
//   "amount": 2000,
//   "person": "jatin",
//   "category": "unknown",
//   "date": "today"
// }

// Input: "5 january 2026 se 10 january 2026 ka hisab dikhao"
// Output:
// {
//   "intent": "query",
//   "startDate": "2026-01-05",
//   "endDate": "2026-01-10"
// }

// Now process:
// "${text}"
// `;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const output = response.text();

//   return output;
// };

const { GoogleGenAI } = require("@google/genai");

// Initialize client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.processUserText = async (text) => {
  const prompt = `
You are a financial assistant.

Convert the user input into STRICT JSON.

Rules:
- Only return JSON (no explanation)
- Detect intent: add, query, delete
- Extract:
  type: expense/income/investment
  amount: number
  person: string
  category: string
  date: ISO format if possible
  startDate & endDate for queries

Examples:

Input: "aaj jatin ko 2000 diye"
Output:
{
  "intent": "add",
  "type": "expense",
  "amount": 2000,
  "person": "jatin",
  "category": "unknown",
  "date": "today"
}

Input: "5 january 2026 se 10 january 2026 ka hisab dikhao"
Output:
{
  "intent": "query",
  "startDate": "2026-01-05",
  "endDate": "2026-01-10"
}

Now process:
"${text}"
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // ✅ stable model
    contents: prompt,
  });

  return response.text;
};
