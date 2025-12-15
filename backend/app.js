import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";
import cartRoutes from "./routes/cart.js";

const app = express();

// ------------------ MIDDLEWARE ------------------
// Enable CORS for frontend (adjust port if different)
app.use(cors({
  origin: true, 
  credentials: true,
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ STATIC FILES ------------------
// __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/cart", cartRoutes);

// ------------------ HEALTH CHECK ------------------
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

export default app;
