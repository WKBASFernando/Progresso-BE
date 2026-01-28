import { Router } from "express";
import Skill from "../models/Skill";
import { authenticate, authorize } from "../middleware/auth"; // Ensure you have these

const router = Router();

// 1. GET ALL SKILLS (Public or Protected)
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().populate("prerequisites");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Error loading Matrix" });
  }
});

// 2. GET SINGLE SKILL
router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate("prerequisites");
    if (!skill) return res.status(404).json({ message: "Node not found" });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Error fetching node" });
  }
});

// --- ADMIN ROUTES BELOW (Protected) ---

// 3. CREATE NEW SKILL
router.post("/", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    res.status(500).json({ message: "Deployment failed" });
  }
});

// 4. UPDATE POSITION (Drag & Drop Save)
router.patch(
  "/:id/position",
  authenticate,
  authorize(["ADMIN"]),
  async (req: any, res: any) => {
    try {
      const { position } = req.body;
      const skill = await Skill.findByIdAndUpdate(
        req.params.id,
        { position },
        { new: true }
      );
      if (!skill)
        return res.status(404).json({ message: "Node lost in space" });
      res.json(skill);
    } catch (err) {
      res.status(500).json({ message: "Position sync failed" });
    }
  }
);

// 5. ADD PREREQUISITE (The Missing Route for Lines!)
router.patch(
  "/:id/prerequisite",
  authenticate,
  authorize(["ADMIN"]),
  async (req: any, res: any) => {
    try {
      const { prerequisiteId } = req.body;

      const skill = await Skill.findById(req.params.id);
      if (!skill)
        return res.status(404).json({ message: "Target node not found" });

      // Prevent duplicates
      if (!skill.prerequisites.includes(prerequisiteId)) {
        skill.prerequisites.push(prerequisiteId);
        await skill.save();
      }

      res.json(skill);
    } catch (err) {
      res.status(500).json({ message: "Neural link failed" });
    }
  }
);

// 6. DELETE SKILL
router.delete("/:id", authenticate, authorize(["ADMIN"]), async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Node deleted from Matrix" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

export default router;
