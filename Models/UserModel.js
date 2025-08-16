// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       maxlength: 50,
//     },

//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       match: [/\S+@\S+\.\S+/, 'Invalid email address'],
//     },
//         password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 6,
//       select: false, // Prevent returning password in queries
//     },

//     role: {
//       type: String,
//       enum: ['customer', 'admin'],
//       default: 'customer',
//     },
//   },
//   {
//     timestamps: true, 
//   }
// );
// const userModel = mongoose.model('user',userSchema)
// module.exports = userModel;


const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number,
        image: String
      }
    ],
    totalAmount: Number,
    orderedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email address']
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },

    phone: {
      type: String,
      maxlength: 15
    },

    addresses: [addressSchema],

    orders: [orderSchema]
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
