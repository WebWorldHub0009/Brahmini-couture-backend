const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // ───── Core details ─────
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // ───── Category & Saree Type ─────
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['saree', 'kidswear', 'accessories', 'family combo', 'customised combo'],
    },

    sareeType: {
      type: String,
      enum: ['pattu', 'handloom', 'customised'],
      required: function () {
        return this.category === 'saree';
      },
    },

    // ───── Optional Sizes ─────
    sizes: {
      type: [String],
      default: [],
    },

    // ───── Cloudinary Images ─────
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    // ───── Inventory & Tags ─────
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
