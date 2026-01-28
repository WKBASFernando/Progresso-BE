import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import skillRoutes from "./routes/skills";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Express = express();

// Middleware
// Updated CORS to allow your specific Vercel frontend and local development
app.use(
  cors({
    origin: ["http://localhost:5173", "https://progresso-fe.vercel.app/"],
    credentials: true,
  })
);

app.use(express.json()); // Allows us to read JSON bodies in POST requests

// Database Connection
// It's best to keep the full Atlas URI in your .env file for security
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://sankalpaangelo_db_user:progresso123@progresso.cvd3buh.mongodb.net/progresso";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully to Atlas"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use Routes
// Note: Your frontend must now use these full paths (e.g., /api/progresso/auth/google)
app.use("/api/progresso/skill", skillRoutes);
app.use("/api/progresso/auth", authRoutes);
app.use("/api/progresso/user", userRoutes);

// Basic health check route to verify the backend is alive
app.get("/", (req, res) => {
  res.send("Progresso API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
