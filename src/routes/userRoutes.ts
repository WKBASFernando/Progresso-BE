import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import Skill from "../models/Skill";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/complete-skill/:skillId", authenticate, async (req: any, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.user.id;

    // 1. Find User & Skill simultaneously
    const [user, skillExists] = await Promise.all([
      User.findById(userId),
      Skill.findById(skillId),
    ]);

    if (!user) return res.status(404).json({ message: "Player not found" });
    if (!skillExists)
      return res.status(404).json({ message: "Skill node does not exist" });

    // 2. Fix: Check completion using string comparison to avoid Reference errors
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

    console.log(`XP Awarded: ${xpPerSkill} to User: ${user.email}`); // Debug log for Koyeb

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
