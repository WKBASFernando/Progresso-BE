import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Initialize Gemini with the key you just provided
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

router.post("/chat", async (req: any, res) => {
  try {
    const { message, currentSkill } = req.body;

    // 1. Configure the Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // 2. The Prompt (The "Brain" of your mentor)
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

    // 3. Get the answer
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({
        reply:
          "My neural link is unstable... (Check your API Key configuration)",
      });
  }
});

export default router;
