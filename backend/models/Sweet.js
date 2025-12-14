import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Sweet", sweetSchema);
