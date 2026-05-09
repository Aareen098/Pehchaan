// routes/adminRoutes.js

const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getSuspiciousVoters,
  getReviewVoters,
  getVerifiedVoters,
  getSingleCase,
  reviewVoter,
  getAllCases,
  searchCases,
} = require(
  "../controllers/adminController"
);

const {
  protect,
  authorize,
} = require(
  "../middleware/authMiddleware"
);


/*
==================================================
ADMIN ONLY ROUTES
==================================================
*/


// ========================================
// TEST ROUTE
// GET /api/admin
// ========================================

router.get("/", (req, res) => {
  res.send(
    "Admin Routes Working"
  );
});


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
// GET ALL ACTIVE CASES
// REVIEW + SUSPICIOUS
//
// GET /api/admin/cases
// ========================================

router.get(
  "/cases",

  protect,

  authorize("admin"),

  getAllCases
);


// ========================================
// GET SINGLE CASE DETAILS
//
// GET /api/admin/case/:voterId
// ========================================

router.get(
  "/case/:voterId",

  protect,

  authorize("admin"),

  getSingleCase
);


// ========================================
// SEARCH CASES
//
// GET /api/admin/search?q=value
// ========================================

router.get(
  "/search",

  protect,

  authorize("admin"),

  searchCases
);


// ========================================
// SUSPICIOUS VOTERS
//
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
//
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
//
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
// APPROVE / REJECT CASE
//
// PUT /api/admin/review/:voterId
//
// BODY:
//
// {
//   "action": "approve",
//   "notes": "Everything verified",
//   "reason": ""
// }
//
// OR
//
// {
//   "action": "reject",
//   "notes": "Duplicate Aadhaar found",
//   "reason": "Fraudulent submission suspected"
// }
// ========================================

router.put(
  "/review/:voterId",

  protect,

  authorize("admin"),

  reviewVoter
);


module.exports = router;