import mongoose, { Schema, Document } from "mongoose";

// 1. Define the Interface (This makes it a module)
export interface ISkill extends Document {
  title: string;
  category: string;
  prerequisites: mongoose.Types.ObjectId[];
  position: {
    x: number;
    y: number;
  };
}

// 2. Define the Schema
const SkillSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  category: { type: String, default: "General" },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
});

// 3. EXPORT IT (Critical Step)
// We use 'export default' so you can use 'import Skill from...' in other files
export default mongoose.model<ISkill>("Skill", SkillSchema);
