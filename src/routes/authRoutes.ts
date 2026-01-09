import { Router } from "express";
import {
  login,
  getMyDetails,
  register,
  registerAdmin,
  googleLogin
} from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMyDetails);
router.post("/auth/admin", authenticate, registerAdmin);
router.post("/google", googleLogin);

export default router;
