import express, { Request, Response } from "express";
import Skill from "../models/Skill";

const router = express.Router();

// 1. GET ALL SKILLS
router.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().populate("prerequisites");
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE SKILL BY ID (Fixes the 404 Transmission Error)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // This allows the SkillDetail page to fetch the specific lesson data
    const skill = await Skill.findById(req.params.id).populate("prerequisites");
    if (!skill) {
      return res
        .status(404)
        .json({ message: "Skill node not found in database" });
    }
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE NEW SKILL (Fixes missing VideoURL and Description)
router.post("/", async (req: Request, res: Response) => {
  // Added description and videoUrl to the destructuring
  const { title, description, category, videoUrl, prerequisites, position } =
    req.body;

  const skill = new Skill({
    title,
    description: description || "", // Ensure data is mapped to the schema
    category,
    videoUrl: videoUrl || "", // Ensure data is mapped to the schema
    prerequisites: prerequisites || [],
    position: position || { x: 0, y: 0 },
  });

  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// 4. AUTO-SYNC POSITION
router.patch("/:id/position", async (req, res) => {
  try {
    const { position } = req.body;
    await Skill.findByIdAndUpdate(req.params.id, { position });
    res.json({ message: "Position synced" });
  } catch (err) {
    res.status(500).json({ message: "Sync failed" });
  }
});

// 5. DELETE NODE
router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Node terminated" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

export default router;
