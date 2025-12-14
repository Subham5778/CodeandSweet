import Cart from "../models/Cart.js";
import Sweet from "../models/Sweet.js";

/**
 * GET CART
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD TO CART
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    const sweet = await Sweet.findById(productId);
    if (!sweet) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: sweet._id,
            name: sweet.name,
            price: sweet.price,
            image: sweet.image, // ✅ IMAGE STORED
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: sweet._id,
          name: sweet.name,
          price: sweet.price,
          image: sweet.image, // ✅ IMAGE STORED
          quantity,
        });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE CART ITEM
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * REMOVE CART ITEM
 */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.remove();
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
