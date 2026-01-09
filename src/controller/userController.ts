import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";

// 1. Get Profile Details
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
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
