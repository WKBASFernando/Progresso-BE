import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary"; // Ensure this path is correct for your project

// 1. Get Profile Details
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // ROBUST ID CHECK:
    // This fixes the "Syncing" hang by looking for the ID in every possible place.
    // Whether your token uses 'id', 'sub', or '_id', this will find it.
    const userId = req.user?.id || req.user?.sub || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Token Error: Identity missing from payload" });
    }

    // Populate 'completedSkills' so the frontend can see the skill titles
    const user = await User.findById(userId)
      .select("-password")
      .populate("completedSkills");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the full profile object needed for your Profile.tsx
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      role: user.role, // Array of roles ["USER", "ADMIN"]
      xp: user.xp || 0, // Default to 0 if new
      level: user.level || 1, // Default to 1 if new
      completedSkills: user.completedSkills || [],
    });
  } catch (err: any) {
    console.error("GetProfile Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Update Profile (Name, etc.)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.user?._id;
    const { firstname, lastname } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated!", data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Upload Avatar to Cloudinary
export const uploadAvatar = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.user?._id;

    // Check if the file came via Multer (req.file) OR Base64 string (req.body.image)
    const fileToUpload = req.file?.path || req.body.image || req.body.avatar;

    if (!fileToUpload) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload to Cloudinary Folder 'progresso_avatars'
    const uploadRes = await cloudinary.uploader.upload(fileToUpload, {
      folder: "progresso_avatars",
    });

    // Save the new secure URL to the user's document
    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: uploadRes.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar updated!",
      avatarUrl: uploadRes.secure_url, // Frontend needs this key specifically
    });
  } catch (err: any) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Avatar upload failed: " + err.message });
  }
};
