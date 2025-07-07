const express = require('express');
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../Controllers/ProductController');

const upload = require('../Middlewares/multer');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');

const router = express.Router();

router.post('/create', protect, isAdmin, upload.array('images'), createProduct);
router.put('/update/:id', protect, isAdmin, upload.array('images'), updateProduct);
router.delete('/delete/:id', protect, isAdmin, deleteProduct);

router.get('/getAll', getAllProducts); // public
router.get('/getOne/:id', getSingleProduct); // public

module.exports = router;
