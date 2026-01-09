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
  avatarUrl?: string; // Added for the profile handling we discussed
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  role: {
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  },
  avatarUrl: { type: String, default: "" }, // Stores Cloudinary URL
});

export const User = mongoose.model<IUser>("User", userSchema);
