import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controller/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All profile routes require being logged in
router.get("/me", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.post("/avatar", authenticate, uploadAvatar);

export default router;
