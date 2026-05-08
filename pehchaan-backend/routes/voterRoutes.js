const express = require("express");
const router = express.Router();

const {
  createVoter,
  getMyVoter,
  getAllVoters,
  getVoterById,
  deleteVoter,
} = require("../controllers/voterController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


/*
========================================
USER ROUTES
========================================
*/


// ========================================
// SUBMIT VOTER FORM
// POST /api/voter
//
// Flow:
// User Form
// → Master Registry Match
// → ML Verification
// → Save Final Result
// ========================================

router.post(
  "/",
  protect,
  authorize("user", "admin"),
  createVoter
);


// ========================================
// GET MY VOTER RECORD
// GET /api/voter/me
// ========================================

router.get(
  "/me",
  protect,
  authorize("user", "admin"),
  getMyVoter
);


/*
========================================
ADMIN ROUTES
========================================
*/


// ========================================
// GET ALL VOTERS
// GET /api/voter/all
//
// IMPORTANT:
// use /all instead of "/"
// because "/" is already POST route
// ========================================

router.get(
  "/all",
  protect,
  authorize("admin"),
  getAllVoters
);


// ========================================
// GET SINGLE VOTER
// GET /api/voter/:id
// ========================================

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getVoterById
);


// ========================================
// DELETE VOTER
// DELETE /api/voter/:id
// ========================================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteVoter
);


module.exports = router;