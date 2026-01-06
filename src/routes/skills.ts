import express, { Request, Response } from "express";
import Skill from "../models/Skill"; // Imports the model we made earlier

const router = express.Router();

// 1. GET ALL SKILLS
// This returns the whole tree structure
router.get("/", async (req: Request, res: Response) => {
  try {
    // .populate('prerequisites') turns the ID strings into actual Skill objects
    // This is crucial for the "Tree" logic to work
    const skills = await Skill.find().populate("prerequisites");
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE SKILL (For Seeding Data)
// We need this so you can use Postman to add the first few skills
router.post("/", async (req: Request, res: Response) => {
  // We explicitly tell TypeScript that we expect these fields
  const { title, category, prerequisites, position } = req.body;

  const skill = new Skill({
    title,
    category,
    // If no prerequisites are sent, default to empty array
    prerequisites: prerequisites || [],
    // If no position is sent, default to 0,0
    position: position || { x: 0, y: 0 },
  });

  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
