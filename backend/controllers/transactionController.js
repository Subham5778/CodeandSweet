import Transaction from "../models/Transaction.js";
import Sweet from "../models/Sweet.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

const foreignCountries = [
  "USA",
  "UNITED STATES",
  "CANADA",
  "UK",
  "UNITED KINGDOM",
  "AUSTRALIA",
  "PAKISTAN",
  "BANGLADESH",
  "NEPAL",
  "SRI LANKA",
  "CHINA",
];

/**
 * CREATE A NEW TRANSACTION (CHECKOUT)
 */
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress, paymentMethod, orderType, tableNumber } = req.body;
    const normalizedOrderType = orderType === "Dine-In" ? "Dine-In" : "Delivery";

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (normalizedOrderType === "Delivery" && !shippingAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (normalizedOrderType === "Dine-In" && !tableNumber) {
      return res.status(400).json({ message: "Table number is required for dine-in orders" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const addressUpper = (shippingAddress || "").toUpperCase();
    const isForeignDelivery =
      normalizedOrderType === "Delivery" &&
      foreignCountries.some((country) => addressUpper.includes(country));

    if (isForeignDelivery) {
      return res.status(400).json({ message: "Sorry, we only deliver inside India." });
    }

    for (const item of items) {
      const sweet = await Sweet.findById(item.productId);
      if (!sweet) {
        return res.status(404).json({ message: `Product '${item.name}' not found` });
      }
      if (sweet.available === false) {
        return res.status(400).json({ message: `'${item.name}' is currently unavailable` });
      }
      if (sweet.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${item.name}'. Available: ${sweet.stock}`,
        });
      }
    }

    for (const item of items) {
      await Sweet.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    const customer = await User.findById(userId).select("name email");

    const transaction = await Transaction.create({
      userId,
      customerEmail: customer?.email || "",
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      totalAmount,
      shippingAddress: normalizedOrderType === "Dine-In" ? "Restaurant dine-in" : shippingAddress,
      paymentMethod,
      orderType: normalizedOrderType,
      tableNumber: normalizedOrderType === "Dine-In" ? tableNumber : "",
      status: "Order Placed",
      trackingStatus: normalizedOrderType === "Dine-In" ? "Preparing at table" : "Preparing for delivery",
    });

    await Cart.findOneAndDelete({ userId });

    console.log(`[MAIL DISPATCH SUCCESS] Receipt email sent successfully to: ${customer?.email || "unknown customer"}`);
    console.log("----------------------------------------");
    console.log(`To: ${customer?.name || "Customer"} <${customer?.email || "unknown"}>`);
    console.log(`Subject: Your Code & Sweet Receipt - Order ID: ${transaction._id}`);
    console.log("Body:");
    console.log("Thank you for ordering from Code & Sweet!");
    console.log("Order Details:");
    items.forEach((item) => {
      console.log(` - ${item.name} x ${item.quantity} (Price: Rs.${item.price})`);
    });
    console.log(`Total Amount: Rs.${totalAmount}`);
    console.log(`Payment Method: ${paymentMethod}`);
    console.log(`Tracking Status: ${transaction.trackingStatus}`);
    if (normalizedOrderType === "Dine-In") {
      console.log(`Dine-In Table Number: ${tableNumber}`);
    } else {
      console.log(`Delivery Address: ${shippingAddress}`);
      console.log("Delivery Service Area: India only");
    }
    console.log("----------------------------------------");

    res.status(201).json({
      message: "Order placed successfully. Check your email for the receipt.",
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
