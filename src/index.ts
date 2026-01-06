import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import skillRoutes from "./routes/skills";
import authRoutes from "./routes/authRoutes"

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to read JSON bodies in POST requests

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/progresso")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/progresso/skill", skillRoutes); 
app.use("/api/progresso/auth", authRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
