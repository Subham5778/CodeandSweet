import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

export default router;
