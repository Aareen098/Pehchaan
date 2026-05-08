// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getSuspiciousVoters,
  getReviewVoters,
  getVerifiedVoters,
  reviewVoter,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


/*
==================================================
ADMIN ONLY ROUTES
==================================================
*/


// ========================================
// DASHBOARD STATISTICS
// GET /api/admin/dashboard
// ========================================

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);


// ========================================
// SUSPICIOUS VOTERS
// GET /api/admin/suspicious
// ========================================

router.get(
  "/suspicious",
  protect,
  authorize("admin"),
  getSuspiciousVoters
);


// ========================================
// REVIEW REQUIRED VOTERS
// GET /api/admin/review
// ========================================

router.get(
  "/review",
  protect,
  authorize("admin"),
  getReviewVoters
);


// ========================================
// VERIFIED VOTERS
// GET /api/admin/verified
// ========================================

router.get(
  "/verified",
  protect,
  authorize("admin"),
  getVerifiedVoters
);


// ========================================
// MANUAL ADMIN REVIEW
// APPROVE / REJECT REVIEW CASE
//
// PUT /api/admin/review/:voterId
//
// Body:
// {
//   "action": "approve"
// }
//
// OR
//
// {
//   "action": "reject"
// }
// ========================================

router.put(
  "/review/:voterId",
  protect,
  authorize("admin"),
  reviewVoter
);


// ========================================
// OPTIONAL TEST ROUTE
// ========================================

router.get("/", (req, res) => {
  res.send(
    "Admin Routes Working"
  );
});

module.exports = router;