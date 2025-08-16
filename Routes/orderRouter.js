const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../Controllers/orderController');

const { protect, isAdmin } = require('../Middlewares/authMiddleware');

// Place a new order (Customer only)
router.post('/', protect, placeOrder);

// Get current user's orders
router.get('/my', protect, getMyOrders);

// Cancel an order by orderId
router.put('/:orderId/cancel', protect, cancelOrder);

// Admin: Get all orders from all users
router.get('/admin/all', protect, isAdmin, getAllOrders);

// Admin: Update order status by orderId
router.put('/admin/:orderId', protect, isAdmin, updateOrderStatus);

module.exports = router;
