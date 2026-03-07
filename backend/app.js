import express from "express";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";
import cartRoutes from "./routes/cart.js";

const app = express();

/* ------------------ MIDDLEWARE ------------------ */

// Enable CORS (allow frontend connection)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse JSON data
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

/* ------------------ ROUTES ------------------ */

// Authentication routes
app.use("/api/auth", authRoutes);

// Sweets routes
app.use("/api/sweets", sweetRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

/* ------------------ HEALTH CHECK ------------------ */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ------------------ EXPORT APP ------------------ */

export default app;
