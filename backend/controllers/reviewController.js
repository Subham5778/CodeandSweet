import Review from "../models/Review.js";
import Transaction from "../models/Transaction.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactionId, productId, rating, comment } = req.body;

    if (!transactionId || !productId || !rating) {
      return res.status(400).json({ message: "Order, product, and rating are required" });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const transaction = await Transaction.findOne({ _id: transactionId, userId });
    if (!transaction) {
      return res.status(404).json({ message: "Purchased order not found" });
    }

    const purchasedItem = transaction.items.find(
      (item) => item.productId && item.productId.toString() === productId
    );

    if (!purchasedItem) {
      return res.status(400).json({ message: "You can review only products you purchased" });
    }

    const review = await Review.findOneAndUpdate(
      { userId, transactionId, productId },
      {
        userId,
        transactionId,
        productId,
        productName: purchasedItem.name,
        rating: numericRating,
        comment: comment || "",
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Review already exists for this item" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
