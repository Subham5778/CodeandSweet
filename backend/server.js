import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";

dotenv.config();

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------ MIDDLEWARE ------------------
// Allow frontend to access backend (adjust port if needed)
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend URL
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

// Health check route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// ------------------ MONGODB CONNECTION ------------------
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL is not defined in .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
