import express, { Request, Response } from "express";
import Skill from "../models/Skill"; 

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().populate("prerequisites");
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { title, category, prerequisites, position } = req.body;

  const skill = new Skill({
    title,
    category,
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

router.patch("/:id/position", async (req, res) => {
  try {
    const { position } = req.body;
    await Skill.findByIdAndUpdate(req.params.id, { position });
    res.json({ message: "Position synced" });
  } catch (err) {
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;
