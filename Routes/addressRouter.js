const express = require('express');
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../Controllers/userController');

const { protect } = require('../Middlewares/authMiddleware');

// All routes are protected by JWT middleware
router.post('/', protect, addAddress);                  // ✅ Add new address
router.get('/', protect, getAddresses);                 // ✅ Get all addresses
router.put('/:index', protect, updateAddress);          // ✅ Update specific address
router.delete('/:index', protect, deleteAddress);       // ✅ Delete specific address
router.patch('/default/:index', protect, setDefaultAddress); // ✅ Set default address

module.exports = router;
