import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerEmail: { type: String, default: "" },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sweet",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, default: "" },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true }, // e.g. "Card", "UPI", "Cash on Delivery"
    status: { type: String, default: "Order Placed" },
    trackingStatus: { type: String, default: "Preparing" },
    orderType: { type: String, enum: ["Delivery", "Dine-In"], default: "Delivery" },
    tableNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
