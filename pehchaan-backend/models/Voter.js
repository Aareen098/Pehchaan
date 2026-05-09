// models/Voter.js

const mongoose = require("mongoose");

const comparisonSchema =
  new mongoose.Schema(
    {
      field: {
        type: String,
      },

      submitted: {
        type: String,
      },

      system: {
        type: String,
      },

      mismatch: {
        type: Boolean,
        default: false,
      },
    },
    { _id: false }
  );

const voterSchema =
  new mongoose.Schema(
    {
      // =====================================
      // LOGGED-IN USER REFERENCE
      // =====================================

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // =====================================
      // USER SUBMITTED FORM DATA
      // =====================================

      name: {
        type: String,
        required: true,
        trim: true,
      },

      dob: {
        type: String,
        required: true,
        trim: true,
      },

      aadhaar: {
        type: String,
        required: true,
        trim: true,
      },

      voterId: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      // =====================================
      // HELPER FIELD
      // =====================================

      isAdult: {
        type: Boolean,
        default: false,
      },

      // =====================================
      // ML CLASSIFICATION
      // =====================================

      classification: {
        type: String,

        enum: [
          "Verified",
          "Suspicious",
          "Fraud",
          "Pending",
          "Review",
        ],

        default: "Pending",
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      conflictScore: {
        type: Number,
        default: 0,
      },

      // =====================================
      // ML SIMILARITY SCORES
      // =====================================

      similarity: {
        name: {
          type: Number,
          default: 0,
        },

        dob: {
          type: Number,
          default: 0,
        },

        address: {
          type: Number,
          default: 0,
        },

        aadhaar: {
          type: Number,
          default: 0,
        },

        voterId: {
          type: Number,
          default: 0,
        },
      },

      // =====================================
      // ML GENERATED DISCREPANCIES
      // =====================================

      discrepancies: [
        {
          type: String,
        },
      ],

      // =====================================
      // SIDE-BY-SIDE COMPARISON DATA
      // =====================================

      comparisonData: [
        comparisonSchema,
      ],

      // =====================================
      // ADMIN REVIEW DETAILS
      // =====================================

      adminNotes: {
        type: String,
        trim: true,
      },

      reviewReason: {
        type: String,
        trim: true,
      },

      reviewDecision: {
        type: String,

        enum: [
          "Approved",
          "Rejected",
        ],
      },

      reviewedAt: {
        type: Date,
      },

      // admin who verified/rejected
      verifiedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // =====================================
      // MASTER REGISTRY MATCH
      // =====================================

      masterRegistryId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "MasterRegistry",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Voter",
  voterSchema
);