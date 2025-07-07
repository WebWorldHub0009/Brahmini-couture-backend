const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email address'],
    },
        password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Prevent returning password in queries
    },

    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true, 
  }
);
const userModel = mongoose.model('user',userSchema)
module.exports = userModel;