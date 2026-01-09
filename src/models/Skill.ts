import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  title: string;
  description: string;
  category: string;
  prerequisites: mongoose.Types.ObjectId[];
  position: { x: number; y: number };
  videoUrl: string; // This will store the YouTube link
}

const SkillSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "WEB" },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  videoUrl: { type: String, default: "" },
});

export default mongoose.model<ISkill>("Skill", SkillSchema);
