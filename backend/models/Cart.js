import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sweet",
        },
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
