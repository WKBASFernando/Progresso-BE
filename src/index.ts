import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import skillRoutes from "./routes/skills";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Express = express();

// --- STEP 2: MOVE CORS TO THE TOP ---
// This must be the first middleware to run!
const allowedOrigins = [
  "http://localhost:5173",
  "https://progresso-fe.vercel.app", // Your actual frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS Blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle the browser's "Preflight" OPTIONS request globally
app.options("*", cors());

// --- OTHER MIDDLEWARE ---
app.use(express.json());

// Database Connection
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://sankalpaangelo_db_user:progresso123@progresso.cvd3buh.mongodb.net/progresso?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully to Atlas"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- ROUTES ---
// Prefix all routes with /api/progresso
app.use("/api/progresso/skill", skillRoutes);
app.use("/api/progresso/auth", authRoutes);
app.use("/api/progresso/user", userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send(
    "Progresso API is running... Connection: " + mongoose.connection.readyState
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
