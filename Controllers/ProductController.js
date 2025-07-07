// Controllers/ProductController.js
const Product = require("../Models/ProductModel");

/**
 * @desc   Create a new product  (admin only)
 * @route  POST /products/create
 */
const createProduct = async (req, res) => {
  try {
    console.log("▶️  createProduct req.body:", req.body);
    console.log("▶️  createProduct req.files:", req.files);

    const {
      name,
      description,
      price,
      category,
      sareeType,
      sizes,
      stock,
      tags,
    } = req.body;

    // ── Validate ─────────────────────────────────────────────
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required." });
    }

    // ── Construct image array ────────────────────────────────
    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    // ── Normalize & build productData ────────────────────────
    const productData = {
      name,
      description,
      price: Number(price),      // convert to Number
      category: category.toLowerCase(),
      stock: Number(stock),      // convert to Number
      images,
    };

    if (sareeType && category.toLowerCase() === "saree") {
      productData.sareeType = sareeType.toLowerCase();
    }

    if (sizes) {
      productData.sizes = Array.isArray(sizes) ? sizes : [sizes];
    }

    if (tags) {
      productData.tags = Array.isArray(tags) ? tags : [tags];
    }

    // ── Save to DB ───────────────────────────────────────────
    const product = await Product.create(productData);

    console.log("✅ Product created:", product._id);

    res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("❌ createProduct Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc   Get ALL products (public)
 * @route  GET /products/getAll
 */
const getAllProducts = async (req, res) => {
  try {
    console.log("▶️  Fetching all products...");
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("❌ getAllProducts Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc   Get single product by ID (public)
 * @route  GET /products/getOne/:id
 */
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ getSingleProduct Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc   Update product by ID (admin only)
 * @route  PUT /products/update/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Convert & normalize fields
    if (updatedData.price)  updatedData.price  = Number(updatedData.price);
    if (updatedData.stock)  updatedData.stock  = Number(updatedData.stock);
    if (updatedData.category) updatedData.category = updatedData.category.toLowerCase();
    if (updatedData.sareeType) updatedData.sareeType = updatedData.sareeType.toLowerCase();

    if (updatedData.sizes && typeof updatedData.sizes === "string") {
      updatedData.sizes = [updatedData.sizes];
    }

    if (updatedData.tags && typeof updatedData.tags === "string") {
      updatedData.tags = [updatedData.tags];
    }

    // If new images uploaded, replace
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("❌ updateProduct Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc   Delete product by ID (admin only)
 * @route  DELETE /products/delete/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ deleteProduct Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
