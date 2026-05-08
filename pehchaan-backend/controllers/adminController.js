// controllers/adminController.js

const Voter = require("../models/Voter");


// ========================================
// GET DASHBOARD STATS
// ========================================

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVoters =
      await Voter.countDocuments();

    const verifiedVoters =
      await Voter.countDocuments({
        classification: "Verified",
      });

    const suspiciousVoters =
      await Voter.countDocuments({
        classification: "Suspicious",
      });

    const reviewVoters =
      await Voter.countDocuments({
        classification: "Review",
      });

    const pendingVoters =
      await Voter.countDocuments({
        classification: "Pending",
      });

    return res.status(200).json({
      success: true,
      stats: {
        totalVoters,
        verifiedVoters,
        suspiciousVoters,
        reviewVoters,
        pendingVoters,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// GET SUSPICIOUS VOTERS
// ========================================

exports.getSuspiciousVoters = async (
  req,
  res
) => {
  try {
    const voters = await Voter.find({
      classification: "Suspicious",
    })
      .populate(
        "userId",
        "name email"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: voters.length,
      voters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// GET REVIEW REQUIRED VOTERS
// ========================================

exports.getReviewVoters = async (
  req,
  res
) => {
  try {
    const voters = await Voter.find({
      classification: "Review",
    })
      .populate(
        "userId",
        "name email"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: voters.length,
      voters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// GET VERIFIED VOTERS
// ========================================

exports.getVerifiedVoters = async (
  req,
  res
) => {
  try {
    const voters = await Voter.find({
      classification: "Verified",
    })
      .populate(
        "userId",
        "name email"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: voters.length,
      voters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// ADMIN MANUAL REVIEW
// APPROVE / REJECT REVIEW CASE
// ========================================

exports.reviewVoter = async (
  req,
  res
) => {
  try {
    const { voterId } = req.params;
    const { action } = req.body;

    const voter =
      await Voter.findById(voterId);

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "Voter not found",
      });
    }

    // =====================================
    // APPROVE CASE
    // =====================================

    if (action === "approve") {
      voter.classification =
        "Verified";

      voter.isVerified = true;
    }

    // =====================================
    // REJECT CASE
    // =====================================

    else if (
      action === "reject"
    ) {
      voter.classification =
        "Suspicious";

      voter.isVerified = false;
    }

    // =====================================
    // INVALID ACTION
    // =====================================

    else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid action. Use approve or reject",
      });
    }

    // Save admin who reviewed
    voter.verifiedBy =
      req.user.id;

    await voter.save();

    return res.status(200).json({
      success: true,
      message:
        "Manual review completed successfully",
      voter,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};