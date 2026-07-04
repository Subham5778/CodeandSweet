import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require user authentication
router.get("/", authenticateToken, getCart);
router.post("/add", authenticateToken, addToCart);
router.put("/update", authenticateToken, updateCartItem);
router.delete("/item/:itemId", authenticateToken, removeCartItem);

export default router;
