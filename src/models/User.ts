import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role[];
  approved: Status;
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  role: { type: [String], enum: Object.values(Role), default: [Role.STUDENT] },
  approved: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  }, // 🔥 FIXED HERE
});

export const User = mongoose.model<IUser>("User", userSchema);
