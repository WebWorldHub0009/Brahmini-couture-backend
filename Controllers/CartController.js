const Cart = require('../Models/CartModel');
const Product = require('../Models/ProductModel');

// ────────────────────────────────────────────────────────────────
// 1️⃣ Add or Update Cart Item
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, size = null } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, size }],
      });
    } else {
      // Check if product with same size exists
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          (item.size || '') === (size || '')
      );

      if (itemIndex > -1) {
        // If found, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If not found, add new item
        cart.items.push({ product: productId, quantity, size });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    console.error('❌ addToCart Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ────────────────────────────────────────────────────────────────
// 2️⃣ Get User Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('❌ getCart Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ────────────────────────────────────────────────────────────────
// 3️⃣ Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        (i.size || '') === (size || '')
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    console.error('❌ updateCartItem Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ────────────────────────────────────────────────────────────────
// 4️⃣ Remove Cart Item
exports.removeCartItem = async (req, res) => {
  try {
    const { productId, size } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId ||
        (item.size || '') !== (size || '')
    );

    await cart.save();
    res.status(200).json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('❌ removeCartItem Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ────────────────────────────────────────────────────────────────
// 5️⃣ Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    console.error('❌ clearCart Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
