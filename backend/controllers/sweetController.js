import Sweet from "../models/Sweet.js";

// Add Sweet
export const addSweet = async (req, res) => {
  try {
    const sweet = new Sweet({
      name: req.body.name,
      price: req.body.price,
      image: req.file ? req.file.path : null
    });

    const savedSweet = await sweet.save();

    res.status(201).json(savedSweet);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Sweets
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};