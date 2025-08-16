const userModel = require('../Models/UserModel');
const { v4: uuidv4 } = require('uuid'); // for generating orderId

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, totalAmount, addressId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include items' });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const selectedAddress = user.addresses[addressId];
    if (!selectedAddress) {
      return res.status(400).json({ message: 'Invalid address selected' });
    }

    const newOrder = {
      orderId: uuidv4(),
      items,
      totalAmount,
      status: 'Pending',
      orderedAt: new Date()
    };

    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const orderId = req.params.orderId;

    const order = user.orders.find(o => o.orderId === orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' });
    }

    order.status = 'Cancelled';
    await user.save();

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Get all orders from all users
const getAllOrders = async (req, res) => {
  try {
    const users = await userModel.find({ 'orders.0': { $exists: true } });

    const allOrders = users.flatMap(user =>
      user.orders.map(order => ({
        ...order.toObject(),
        userId: user._id,
        userEmail: user.email
      }))
    );

    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const user = await userModel.findOne({ 'orders.orderId': orderId });
    if (!user) return res.status(404).json({ message: 'Order not found' });

    const order = user.orders.find(o => o.orderId === orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await user.save();

    res.status(200).json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};
