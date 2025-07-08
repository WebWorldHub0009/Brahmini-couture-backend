const express = require('express');
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../Controllers/ProductController');

const upload = require('../Middlewares/multer');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');

const router = express.Router();

// Protected admin routes
router.post('/create', protect, isAdmin, upload.array('images'), createProduct);
router.put('/update/:id', protect, isAdmin, upload.array('images'), updateProduct);
router.delete('/delete/:id', protect, isAdmin, deleteProduct);

// Public routes
router.get('/getAll', getAllProducts);
router.get('/getOne/:id', getSingleProduct);

// ✅ Correct export
module.exports = router;
