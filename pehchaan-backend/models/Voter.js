// models/Voter.js

const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    // logged-in user reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // form data submitted by user
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

    // helper field
    isAdult: {
      type: Boolean,
      default: false,
    },

    // ML output
    classification: {
      type: String,
      enum: [
        "Verified",
        "Suspicious",
        "Fraud",
        "Pending",
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

    // similarity scores from ML
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

    // matched master registry reference
    masterRegistryId: {
      type: mongoose.Schema.Types.ObjectId,
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