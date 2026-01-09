import { Request, Response } from "express";
import Skill from "../models/Skill";
import cloudinary from "../config/cloudinary";

export const createSkillWithVideo = async (req: Request, res: Response) => {
  try {
    const { title, description, category, prerequisites, position, videoFile } =
      req.body;

    let videoData = { url: "", public_id: "" };

    // If a video file (Base64) is provided, upload it to Cloudinary
    if (videoFile) {
      const uploadRes = await cloudinary.uploader.upload(videoFile, {
        resource_type: "video",
        folder: "skill_tree_videos",
      });
      videoData.url = uploadRes.secure_url;
      videoData.public_id = uploadRes.public_id;
    }

    const newSkill = new Skill({
      title,
      description,
      category,
      prerequisites: prerequisites || [],
      position: position || { x: 0, y: 0 },
      videoUrl: videoData.url,
      videoPublicId: videoData.public_id,
    });

    await newSkill.save();
    res.status(201).json({ message: "Skill Created!", data: newSkill });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
