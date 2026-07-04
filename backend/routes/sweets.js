import express from "express";
import Sweet from "../models/Sweet.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* ------------------ PUBLIC ROUTES ------------------ */

// Get all sweets
router.get("/", async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ------------------ ADMIN ROUTES ------------------ */

// Add new sweet
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
<<<<<<< HEAD
        image: req.file?.path 
=======
        image: req.file ? req.file.path : ""
>>>>>>> d9f7208 (Redesign the webpage)
      });

      await sweet.save();

      res.status(201).json(sweet);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update sweet
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
        sweet.image = req.file.path;
      }

      await sweet.save();

      res.status(200).json(sweet);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete sweet
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

// Restock sweet
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

// Purchase sweet
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