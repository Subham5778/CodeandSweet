import express from "express";
import {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
} from "../controllers/transactionController.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createTransaction);
router.get("/", authenticateToken, getUserTransactions);
router.get("/all", authenticateToken, isAdmin, getAllTransactions);

export default router;
