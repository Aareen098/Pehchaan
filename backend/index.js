// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// =====================================
// Middleware
// =====================================

app.use(
  cors({
    origin: [
      "https://pehchaan-two.vercel.app",
      "https://pehchaan-bbkd58kwd-aareens-projects.vercel.app",
    ],

    credentials: true,
  })
);
app.use(express.json());


// =====================================
// MongoDB Connection
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Error ❌", err);
    process.exit(1);
  });


// =====================================
// Test Route
// =====================================

app.get("/", (req, res) => {
  res.send("🚀 Pehchaan Backend Running");
});


// =====================================
// Routes
// =====================================

// Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Voter Routes
app.use("/api/voter", require("./routes/voterRoutes"));

// Admin Routes
app.use("/api/admin", require("./routes/adminRoutes"));


// =====================================
// Global Error Handler
// =====================================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});


// =====================================
// Server Start
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});