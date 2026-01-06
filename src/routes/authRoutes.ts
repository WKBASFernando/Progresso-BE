import { Router } from "express";
import {
  login,
  getMyDetails,
  register,
  registerAdmin,
} from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMyDetails);
router.post("/auth/admin", authenticate, registerAdmin);

export default router;
