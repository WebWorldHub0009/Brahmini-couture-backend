const userModel = require("../Models/UserModel");
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({ message: "Email and password are required", success: false });
    }

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: "Login successful",
      success: true,
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.json({ message: err.message, success: false });
  }
};

const userRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
   
    if (!name || !email || !password) {
      return res.json({ message: "All fields are required", success: false });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists, please login", success: false });
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer' 
    });

    if (user) {
      return res.json({ message: "User created successfully", success: true });
    } else {
      return res.json({ message: "Error in creating user", success: false });
    }

  } catch (err) {
    return res.json({ message: err.message, success: false });
  }
};

module.exports = {
    userLogin,
    userRegister
}