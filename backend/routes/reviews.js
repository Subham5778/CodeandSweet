import express from "express";
import { createReview, getMyReviews, getPublicReviews } from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/public", getPublicReviews);
router.get("/mine", authenticateToken, getMyReviews);
router.post("/", authenticateToken, createReview);

export default router;
