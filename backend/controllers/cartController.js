import Cart from "../models/Cart.js";
import Sweet from "../models/Sweet.js";

/**
 * GET CART
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

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
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const sweet = await Sweet.findById(productId);
    if (!sweet) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (sweet.available === false) {
      return res.status(400).json({ message: "This product is currently unavailable" });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    if (sweet.stock < quantity) {
      return res.status(400).json({ message: `Only ${sweet.stock} item(s) available in stock` });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId: sweet._id,
            name: sweet.name,
            price: sweet.price,
            image: sweet.image,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId && item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        if (cart.items[itemIndex].quantity + quantity > sweet.stock) {
          return res.status(400).json({ message: `Only ${sweet.stock} item(s) available in stock` });
        }
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId: sweet._id,
          name: sweet.name,
          price: sweet.price,
          image: sweet.image,
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
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const sweet = await Sweet.findById(item.productId);
    if (!sweet) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (sweet.available === false) {
      return res.status(400).json({ message: "This product is currently unavailable" });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    if (sweet.stock < quantity) {
      return res.status(400).json({ message: `Only ${sweet.stock} item(s) available in stock` });
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
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to remove it safely
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
