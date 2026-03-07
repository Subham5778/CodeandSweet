import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";

dotenv.config();

const app = express();

// ------------------ MIDDLEWARE ------------------

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ------------------ ROUTES ------------------

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

// Health check
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

// ------------------ START SERVER ------------------

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
