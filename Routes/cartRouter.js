const express = require('express');
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../Controllers/CartController');

const { protect } = require('../Middlewares/authMiddleware');

// All routes are protected — only logged-in users can access their cart

// ✅ Add to cart
router.post('/add', protect, addToCart);

// ✅ Get current user's cart
router.get('/', protect, getCart);

// ✅ Update quantity of an item
router.put('/update', protect, updateCartItem);

// ✅ Remove specific item
router.delete('/remove', protect, removeCartItem);

// ✅ Clear entire cart
router.delete('/clear', protect, clearCart);

module.exports = router;
