import { Request, Response } from "express";
import { IUser, Role, User } from "../models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/token";
import { AuthRequest } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body; 
  try {
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );

    const { email, given_name, family_name, picture } = googleResponse.data;

    if (!email) {
      return res.status(400).json({ message: "Google authentication failed" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstname: given_name,
        lastname: family_name || "",
        email: email,
        password: Math.random().toString(36).slice(-10), 
        avatarUrl: picture,
        role: [Role.USER],
      });
      await user.save();
    }

    const accessToken = signAccessToken(user);

    res.status(200).json({
      message: "Success",
      data: {
        email: user.email,
        roles: user.role,
        accessToken,
      },
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Internal server error during Google login" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role !== Role.ADMIN && role !== Role.USER) {
      return res.status(400).json({ message: "Invalid role assigned" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: [role], 
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, existingUser.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken(existingUser);
    const refreshToken = signRefreshToken(existingUser);

    res.status(200).json({
      message: "Success",
      data: {
        email: existingUser.email,
        roles: existingUser.role, 
        accessToken,
        refreshToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.sub;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Ok",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
};

export const registerAdmin = (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented. Use standard register." });
};
