import Sweet from "../models/Sweet.js";

export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
