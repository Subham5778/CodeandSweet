import express from "express";
import { createReview, getMyReviews } from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/mine", authenticateToken, getMyReviews);
router.post("/", authenticateToken, createReview);

export default router;
