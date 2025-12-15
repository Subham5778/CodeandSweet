import express from "express";
import Sweet from "../models/Sweet.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ------------------ MULTER SETUP ------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
  cb(null, "uploads");
},
  
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ------------------ PUBLIC ROUTES ------------------ */

// ✅ Get all sweets (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------ ADMIN ROUTES ------------------ */

// ✅ Add new sweet (ADMIN)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, category, price, stock } = req.body;

      if (!name || !category || !price || !stock) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const sweet = new Sweet({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        image: req.file ? req.file.filename : "",
      });

      await sweet.save();
      res.status(201).json(sweet);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ Update sweet (ADMIN)
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const sweet = await Sweet.findById(req.params.id);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      const { name, category, price, stock } = req.body;

      if (name) sweet.name = name;
      if (category) sweet.category = category;
      if (price) sweet.price = Number(price);
      if (stock) sweet.stock = Number(stock);

      if (req.file) {
       sweet.image = req.file.filename;
      }

      await sweet.save();
      res.status(200).json(sweet);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ Delete sweet (ADMIN)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }
    res.json({ message: "Sweet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Restock sweet (ADMIN)
router.post("/:id/restock", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.stock += Number(quantity);
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Purchase sweet (USER)
router.post("/:id/purchase", authenticateToken, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    sweet.stock -= 1;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
