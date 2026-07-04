import express from "express";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";
import cartRoutes from "./routes/cart.js";
import transactionRoutes from "./routes/transactions.js";

<<<<<<< HEAD
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

=======
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
>>>>>>> d9f7208 (Redesign the webpage)
app.use("/api/auth", authRoutes);

// Sweets routes
app.use("/api/sweets", sweetRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);
app.use("/api/transactions", transactionRoutes);

/* ------------------ HEALTH CHECK ------------------ */

<<<<<<< HEAD
=======
/* ------------------ HEALTH CHECK ------------------ */

>>>>>>> d9f7208 (Redesign the webpage)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ------------------ EXPORT APP ------------------ */

<<<<<<< HEAD
export default app;
=======
export default app;
>>>>>>> d9f7208 (Redesign the webpage)
