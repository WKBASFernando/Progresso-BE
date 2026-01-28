import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import Skill from "../models/Skill";
import { authenticate } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controller/userController";
import upload from "../middleware/upload"; // Ensure you have multer middleware here

const router = Router();

// --- 1. PROFILE ROUTES (Essential for Profile Page) ---
// These routes MUST exist for the frontend to load your identity

// GET /api/progresso/user/me -> Loads the Profile Page
router.get("/me", authenticate, getProfile);

// PUT /api/progresso/user/me -> Updates Name/Details
router.put("/me", authenticate, updateProfile);

// POST /api/progresso/user/avatar -> Uploads Profile Picture
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

// --- 2. XP & SKILL COMPLETION ROUTE ---
// This is your XP logic, fixed to handle the ID correctly

router.post("/complete-skill/:skillId", authenticate, async (req: any, res) => {
  try {
    const { skillId } = req.params;

    // FIX: Robust ID Check. Middleware might use 'sub' or 'id'. We check both.
    const userId = req.user.sub || req.user.id || req.user._id;

    // 1. Find User & Skill simultaneously
    const [user, skillExists] = await Promise.all([
      User.findById(userId),
      Skill.findById(skillId),
    ]);

    if (!user) return res.status(404).json({ message: "Player not found" });
    if (!skillExists)
      return res.status(404).json({ message: "Skill node does not exist" });

    // 2. Check completion using string comparison to avoid Reference errors
    const isAlreadyDone = user.completedSkills.some(
      (id) => id.toString() === skillId
    );

    if (isAlreadyDone) {
      return res.status(400).json({ message: "Intel already synchronized" });
    }

    // 3. Dynamic XP Math
    const totalSkillsCount = await Skill.countDocuments();
    const xpPerSkill = Math.floor(5000 / (totalSkillsCount || 1));

    // 4. Update and Save
    user.completedSkills.push(new mongoose.Types.ObjectId(skillId) as any);
    user.xp = (user.xp || 0) + xpPerSkill;
    user.level = Math.floor(user.xp / 1000) + 1;

    await user.save();

    console.log(`XP Awarded: ${xpPerSkill} to User: ${user.email}`);

    res.json({
      success: true,
      addedXp: xpPerSkill,
      totalXp: user.xp,
      currentLevel: user.level,
    });
  } catch (err: any) {
    console.error("XP CRITICAL FAILURE:", err.message);
    res.status(500).json({ message: "Server error during XP allocation" });
  }
});

export default router;
