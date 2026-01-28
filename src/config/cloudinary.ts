import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure env vars are loaded if this file is imported independently
dotenv.config();

// 1. Sanity Check: Ensure keys exist before trying to connect
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    ` Missing required Cloudinary environment variables: ${missingVars.join(
      ", "
    )}\n` + `    Please add them to your .env file.`
  );
}

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Export the configured instance
export default cloudinary;
