import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// --- 1. DEBUG ROUTE (Check available models) ---
// This tells us exactly what your API key is allowed to use.
router.get("/check-models", async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("API Key is missing in environment variables");

    // Fetch directly from Google
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. CHAT ROUTE ---
router.post("/chat", async (req: any, res) => {
  try {
    const { message, currentSkill } = req.body;

    // Use "gemini-1.5-flash" which is the standard free model right now
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "Matrix AI", a witty and helpful coding mentor inside a game called "Progresso".
      
      Context:
      - The user is currently studying: "${
        currentSkill || "General Dashboard"
      }".
      - User's Question: "${message}"

      Instructions:
      - Keep your answer short (max 3 sentences).
      - Use gaming metaphors (XP, leveling up, bugs as monsters) where appropriate.
      - Be encouraging but technical.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error: any) {
    console.error("AI Error:", error);
    // Send the actual error message so we can debug it in the frontend console
    res.status(500).json({
      reply: "AI Error",
      details: error.message,
    });
  }
});

export default router;
