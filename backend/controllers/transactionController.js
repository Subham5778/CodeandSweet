import Transaction from "../models/Transaction.js";
import Sweet from "../models/Sweet.js";
import Cart from "../models/Cart.js";

/**
 * CREATE A NEW TRANSACTION (CHECKOUT)
 */
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // 1. Verify and update stock for each sweet in the transaction
    for (const item of items) {
      const sweet = await Sweet.findById(item.productId);
      if (!sweet) {
        return res.status(404).json({ message: `Sweet '${item.name}' not found` });
      }
      if (sweet.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${item.name}'. Available: ${sweet.stock}`,
        });
      }
    }

    // 2. Decrement stock
    for (const item of items) {
      await Sweet.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 3. Create the transaction record
    const transaction = await Transaction.create({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Completed",
    });

    // 4. Clear the user's cart in the DB if it exists
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Order placed successfully! 🎉",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET USER TRANSACTIONS (ORDER HISTORY)
 */
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL TRANSACTIONS (ADMIN ONLY)
 */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
