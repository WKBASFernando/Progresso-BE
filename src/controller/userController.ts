import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";

// 1. Get Profile Details
// Updated Controller Logic
export const getProfile = async (req: any, res: Response) => {
  try {
    // IMPORTANT: Your middleware uses 'sub', so we must use 'req.user.sub'
    const userId = req.user.sub; 
    
    const user = await User.findById(userId).select("-password").populate("completedSkills");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Explicitly send the progress data
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatarUrl: user.avatarUrl,
      xp: user.xp || 0,
      level: user.level || 1,
      completedSkills: user.completedSkills || [],
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Update Profile (Name, etc.)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstname, lastname } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.sub,
      { firstname, lastname },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated!", data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Upload Avatar to Cloudinary
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.body.image)
      return res.status(400).json({ message: "No image provided" });

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(req.body.image, {
      folder: "progresso_avatars",
    });

    // Save the URL to the user in DB
    // Note: You might need to add 'avatarUrl: String' to your User.ts model first!
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { avatarUrl: uploadRes.secure_url },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Avatar updated!", url: uploadRes.secure_url });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
