// controllers/voterController.js

const axios = require("axios");
const Voter = require("../models/Voter");
const MasterRegistry = require("../models/MasterRegistry");


// ========================================
// HELPER → FORMAT DOB
// dd/mm/yyyy → yyyy-mm-dd
// ========================================

const formatDOB = (dob) => {
  if (!dob) return dob;

  // already formatted
  if (dob.includes("-")) {
    return dob;
  }

  const parts = dob.split("/");

  if (parts.length !== 3) {
    return dob;
  }

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
};


// ========================================
// HELPER → CHECK 18+
// ========================================

const isAdult = (dob) => {
  const birthDate = new Date(dob);

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age--;
  }

  return age >= 18;
};


// ========================================
// GENERATE DISCREPANCIES
// ========================================

const generateDiscrepancies = (
  similarity
) => {
  const discrepancies = [];

  if (
    (similarity.name_sim || 0) <
    80
  ) {
    discrepancies.push(
      "Name Mismatch"
    );
  }

  if (
    (similarity.dob_sim || 0) <
    80
  ) {
    discrepancies.push(
      "DOB Mismatch"
    );
  }

  if (
    (similarity.addr_sim || 0) <
    80
  ) {
    discrepancies.push(
      "Address Mismatch"
    );
  }

  if (
    (similarity.aadhaar_sim || 0) <
    100
  ) {
    discrepancies.push(
      "Aadhaar Mismatch"
    );
  }

  if (
    (similarity.id_sim || 0) <
    100
  ) {
    discrepancies.push(
      "Voter ID Mismatch"
    );
  }

  return discrepancies;
};


// ========================================
// GENERATE COMPARISON TABLE
// ========================================

const generateComparisonData = ({
  submitted,
  officialRecord,
  similarity,
}) => {
  return [
    {
      field: "Name",

      submitted:
        submitted.name,

      system:
        officialRecord.name,

      mismatch:
        (similarity.name_sim ||
          0) < 80,
    },

    {
      field: "DOB",

      submitted:
        submitted.dob,

      system:
        officialRecord.dob,

      mismatch:
        (similarity.dob_sim ||
          0) < 80,
    },

    {
      field: "Address",

      submitted:
        submitted.address,

      system:
        officialRecord.address,

      mismatch:
        (similarity.addr_sim ||
          0) < 80,
    },

    {
      field: "Aadhaar",

      submitted:
        submitted.aadhaar,

      system:
        officialRecord.aadhaar,

      mismatch:
        (
          similarity.aadhaar_sim ||
          0
        ) < 100,
    },

    {
      field: "Voter ID",

      submitted:
        submitted.voterId,

      system:
        officialRecord.voterId,

      mismatch:
        (similarity.id_sim ||
          0) < 100,
    },
  ];
};


// ========================================
// CREATE VOTER
// ========================================

exports.createVoter = async (
  req,
  res
) => {
  try {
    const {
      name,
      dob,
      aadhaar,
      voterId,
      address,
      state,
      city,
    } = req.body;

    console.log(
      "===================================="
    );

    console.log(
      "📥 USER SUBMITTED DATA:"
    );

    console.log(req.body);

    console.log(
      "===================================="
    );

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !name ||
      !dob ||
      !aadhaar ||
      !voterId ||
      !address ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Please fill all required fields",
      });
    }

    // =====================================
    // FORMAT DOB
    // =====================================

    const formattedDOB =
      formatDOB(dob);

    // =====================================
    // AGE CHECK
    // =====================================

    const adultStatus =
      isAdult(formattedDOB);

    if (!adultStatus) {
      return res.status(400).json({
        success: false,

        message:
          "User must be 18+ to register as voter",
      });
    }

    // =====================================
    // PREVENT MULTIPLE SUBMISSIONS
    // =====================================

    const alreadySubmitted =
      await Voter.findOne({
        userId: req.user.id,
      });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,

        message:
          "You have already submitted voter details",
      });
    }

    // =====================================
    // FIND MASTER RECORD
    // =====================================

    const officialRecord =
      await MasterRegistry.findOne(
        {
          $or: [
            { aadhaar },
            { voterId },
          ],
        }
      );

    if (!officialRecord) {
      return res.status(404).json({
        success: false,

        message:
          "No matching record found in Master Registry",
      });
    }

    // =====================================
    // DEFAULT VALUES
    // =====================================

    let classification =
      "Pending";

    let isVerified = false;

    let conflictScore = 0;

    let similarity = {};

    let discrepancies = [];

    let comparisonData = [];

    // =====================================
    // SEND DATA TO ML
    // =====================================

    try {
      console.log(
        "🚀 DATA SENT TO ML:"
      );

      console.log({
        user: {
          name,

          dob: formattedDOB,

          aadhaar,

          voter_id: voterId,

          address,

          state,

          city,
        },

        record: {
          name:
            officialRecord.name,

          dob:
            officialRecord.dob,

          aadhaar:
            officialRecord.aadhaar,

          voter_id:
            officialRecord.voterId,

          address:
            officialRecord.address,

          state:
            officialRecord.state,

          city:
            officialRecord.city,
        },
      });

      const mlResponse =
        await axios.post(
          "http://localhost:8000/verify",
          {
            user: {
              name,

              dob:
                formattedDOB,

              aadhaar,

              voter_id:
                voterId,

              address,

              state,

              city,
            },

            record: {
              name:
                officialRecord.name,

              dob:
                officialRecord.dob,

              aadhaar:
                officialRecord.aadhaar,

              voter_id:
                officialRecord.voterId,

              address:
                officialRecord.address,

              state:
                officialRecord.state,

              city:
                officialRecord.city,
            },
          },

          {
            timeout: 10000,
          }
        );

      console.log(
        "✅ ML RESPONSE:"
      );

      console.log(
        mlResponse.data
      );

      // =====================================
      // GET ML VALUES
      // =====================================

      conflictScore =
        Number(
          mlResponse.data
            .conflictScore
        ) || 0;

      similarity =
        mlResponse.data
          .features || {};

      // =====================================
      // USE ML CLASSIFICATION
      // =====================================

      const rawStatus =
        (
          mlResponse.data
            .status || "Pending"
        ).toLowerCase();

      if (
        rawStatus ===
        "verified"
      ) {
        classification =
          "Verified";
      }

      else if (
        rawStatus ===
        "suspicious"
      ) {
        classification =
          "Suspicious";
      }

      else if (
        rawStatus ===
        "review"
      ) {
        classification =
          "Review";
      }

      else {
        classification =
          "Pending";
      }

      // =====================================
      // VERIFIED STATUS
      // =====================================

      isVerified =
        classification ===
        "Verified";

      // =====================================
      // GENERATE DISCREPANCIES
      // =====================================

      discrepancies =
        generateDiscrepancies(
          similarity
        );

      // =====================================
      // GENERATE COMPARISON DATA
      // =====================================

      comparisonData =
        generateComparisonData({
          submitted: {
            name,

            dob:
              formattedDOB,

            aadhaar,

            voterId,

            address,
          },

          officialRecord,

          similarity,
        });

    } catch (mlError) {
      console.log(
        "ML Verification Error:"
      );

      console.log(
        mlError.message
      );

      classification =
        "Pending";

      isVerified = false;

      conflictScore = 0;

      similarity = {};

      discrepancies = [
        "ML Verification Failed",
      ];

      comparisonData = [];
    }

    // =====================================
    // SAVE VOTER
    // =====================================

    const voter =
      await Voter.create({
        userId: req.user.id,

        name,

        dob: formattedDOB,

        aadhaar,

        voterId,

        address,

        state,

        city,

        isAdult:
          adultStatus,

        classification,

        isVerified,

        conflictScore,

        similarity: {
          name:
            similarity.name_sim ||
            0,

          dob:
            similarity.dob_sim ||
            0,

          address:
            similarity.addr_sim ||
            0,

          aadhaar:
            similarity.aadhaar_sim ||
            0,

          voterId:
            similarity.id_sim ||
            0,
        },

        discrepancies,

        comparisonData,

        masterRegistryId:
          officialRecord._id,
      });

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(201).json({
      success: true,

      message:
        "Voter verification completed successfully",

      voter,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};


// ========================================
// GET MY VOTER
// ========================================

exports.getMyVoter = async (
  req,
  res
) => {
  try {
    const voter =
      await Voter.findOne({
        userId: req.user.id,
      })
        .populate(
          "masterRegistryId",
          "name aadhaar voterId"
        )
        .populate(
          "verifiedBy",
          "name email"
        );

    if (!voter) {
      return res.status(404).json({
        success: false,

        message:
          "No voter record found",
      });
    }

    return res.status(200).json({
      success: true,

      voter,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};


// ========================================
// GET ALL VOTERS (ADMIN)
// ========================================

exports.getAllVoters = async (
  req,
  res
) => {
  try {
    const voters =
      await Voter.find()
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "verifiedBy",
          "name email"
        )
        .populate(
          "masterRegistryId",
          "name aadhaar voterId"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        voters.length,

      voters,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};


// ========================================
// GET SINGLE VOTER (ADMIN)
// ========================================

exports.getVoterById = async (
  req,
  res
) => {
  try {
    const voter =
      await Voter.findById(
        req.params.id
      )
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "verifiedBy",
          "name email"
        )
        .populate(
          "masterRegistryId",
          "name aadhaar voterId"
        );

    if (!voter) {
      return res.status(404).json({
        success: false,

        message:
          "Voter not found",
      });
    }

    return res.status(200).json({
      success: true,

      voter,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};


// ========================================
// DELETE VOTER (ADMIN)
// ========================================

exports.deleteVoter = async (
  req,
  res
) => {
  try {
    const voter =
      await Voter.findById(
        req.params.id
      );

    if (!voter) {
      return res.status(404).json({
        success: false,

        message:
          "Voter not found",
      });
    }

    await voter.deleteOne();

    return res.status(200).json({
      success: true,

      message:
        "Voter deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};