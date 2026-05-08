const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================================
// GENERATE JWT TOKEN
// =====================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


// =====================================
// REGISTER (ONLY NORMAL USER)
// =====================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      state,
      city,
    } = req.body;

    // Check existing user
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create normal user only
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      state,
      city,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user),
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================
// LOGIN
// =====================================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================
// GET PROFILE (PROTECTED)
// =====================================

exports.getProfile = async (req, res) => {
  try {
    const user =
      await User.findById(req.user.id)
        .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};