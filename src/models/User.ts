import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role[];
  avatarUrl?: string;
  // --- XP & PROGRESS FIELDS ---
  completedSkills: mongoose.Types.ObjectId[]; // Array of mastered node IDs
  xp: number; // Total Skill Points earned
  level: number; // Player's current rank
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    role: {
      type: [String],
      enum: Object.values(Role),
      default: [Role.USER],
    },
    avatarUrl: { type: String, default: "" },

    // --- XP & PROGRESS LOGIC ---
    completedSkills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        default: [],
      },
    ],
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Useful for tracking when a player joined the Matrix
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
