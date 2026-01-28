import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import skillRoutes from "./routes/skills";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import aiRoutes from "./routes/aiRoutes"

dotenv.config();

const app: Express = express();

// --- STEP 1: FLEXIBLE CORS (The Fix) ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://progresso-fe.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      // 2. Allow localhost and your main Vercel domain
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 3. AUTO-ALLOW any Vercel preview URL (Safe for testing)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("⛔ CORS Blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle Preflight requests globally
app.options(/(.*)/, cors());

app.use(express.json());

// --- DATABASE CONNECTION ---
// Note: It is safer to use process.env.MONGO_URI in production!
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://sankalpaangelo_db_user:progresso123@progresso.cvd3buh.mongodb.net/progresso?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- ROUTES ---
app.use("/api/progresso/skill", skillRoutes);
app.use("/api/progresso/auth", authRoutes);
app.use("/api/progresso/user", userRoutes);
app.use("/api/progresso/ai", aiRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send(
    "Progresso API is online. DB State: " + mongoose.connection.readyState
  );
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
