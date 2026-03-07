import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sweet", sweetSchema);
