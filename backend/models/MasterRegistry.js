const mongoose = require("mongoose");

const masterRegistrySchema = new mongoose.Schema(
  {
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
      unique: true,
      trim: true,
    },

    voterId: {
      type: String,
      required: true,
      unique: true,
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

    isVerifiedOfficially: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MasterRegistry",
  masterRegistrySchema
);