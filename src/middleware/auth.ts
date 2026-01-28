import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Define what the User Payload inside the token looks like
interface UserPayload {
  id: string; // or 'sub' depending on how you sign it
  role: string[]; // Important: This must be an array to match your User model
}

export interface AuthRequest extends Request {
  user?: UserPayload | any;
}

// 1. AUTHENTICATE (Verifies the user is logged in)
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Format: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 2. AUTHORIZE (Checks if the user has the required Rank/Role)
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Safety check: Ensure authenticate ran first
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Access Forbidden: Unknown Identity" });
    }

    // Check if the user has ANY of the required roles
    // We use .some() because req.user.role is an array (e.g. ["USER", "ADMIN"])
    const hasPermission = req.user.role.some((userRole: string) =>
      allowedRoles.includes(userRole)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: `Access Forbidden: Requires ${allowedRoles.join(" or ")} rank`,
      });
    }

    next();
  };
};
