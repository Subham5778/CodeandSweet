import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";
import cartRoutes from "./routes/cart.js";
import transactionRoutes from "./routes/transactions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ------------------ MIDDLEWARE ------------------ */

// Enable CORS
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

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------ ROUTES ------------------ */

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transactions", transactionRoutes);

/* ------------------ HEALTH CHECK ------------------ */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ------------------ EXPORT APP ------------------ */

export default app;
