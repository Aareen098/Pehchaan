const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// 🔹 Public routes
router.post("/register", register);
router.post("/login", login);

// 🔹 Protected route
router.get("/profile", protect, getProfile);


/* ================= ADMIN SETUP ================= */

// ⚠️ Use ONLY once → then REMOVE this route
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/setup-admin", async (req, res) => {
  try {
    const { name, email, password, state, city } = req.body;

    // 🔥 Check if ANY admin exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // 🔥 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      state,
      city,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;