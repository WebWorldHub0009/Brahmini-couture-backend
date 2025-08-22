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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: "User created successfully",
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



const addAddress = async (req, res) => {
  try {
    const { fullName, phone, pincode, addressLine, city, state, country, isDefault } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // If it's default, unset previous defaults
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    let newAddress = {
      fullName,
      phone,
      pincode,
      addressLine,
      city,
      state,
      country,
      isDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add address', error: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { index } = req.params;
    const { fullName, phone, pincode, addressLine, city, state, country, isDefault } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.addresses[index]) return res.status(404).json({ message: 'Address not found' });

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses[index] = {
      fullName,
      phone,
      pincode,
      addressLine,
      city,
      state,
      country,
      isDefault,
    };

    await user.save();

    res.status(200).json({ message: 'Address updated', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { index } = req.params;

    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.addresses[index]) return res.status(404).json({ message: 'Address not found' });

    user.addresses.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Address deleted', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};


const setDefaultAddress = async (req, res) => {
  try {
    const { index } = req.params;

    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.addresses[index]) return res.status(404).json({ message: 'Address not found' });

    user.addresses.forEach((addr, i) => {
      addr.isDefault = i == index;
    });

    await user.save();

    res.status(200).json({ message: 'Default address updated', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set default address', error: error.message });
  }
};

// ✅ Get logged-in user profile (with orders)
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = { userLogin, userRegister, addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress, getUserProfile };


