import dotenv from "dotenv";
<<<<<<< HEAD
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

=======
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import sweetRoutes from "./routes/sweets.js";
import cartRoutes from "./routes/cart.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------ MIDDLEWARE ------------------
// Allow frontend to access backend from any origin
app.use(cors({
  origin: true, // allow all origins
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/transactions", transactionRoutes);

// Health check route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

>>>>>>> d9f7208 (Redesign the webpage)
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
