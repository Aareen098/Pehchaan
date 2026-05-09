// src/services/api.js

import axios from "axios";


// =====================================
// AXIOS INSTANCE
// =====================================

const API = axios.create({
  baseURL:
  "https://pehchaan-backend.onrender.com/api",

  headers: {
    "Content-Type":
      "application/json",
  },
});


// =====================================
// AUTO ADD TOKEN TO EVERY REQUEST
// =====================================

API.interceptors.request.use(
  (req) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================
// GLOBAL RESPONSE HANDLER
// =====================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    // Unauthorized
    if (
      error.response?.status ===
      401
    ) {
      console.log(
        "Unauthorized Access"
      );
    }

    // Forbidden
    if (
      error.response?.status ===
      403
    ) {
      console.log(
        "Access Denied"
      );
    }

    return Promise.reject(error);
  }
);


// =====================================
// AUTH APIs
// =====================================

// LOGIN

export const loginUser = (
  formData
) =>
  API.post(
    "/auth/login",
    formData
  );

// REGISTER

export const registerUser = (
  formData
) =>
  API.post(
    "/auth/register",
    formData
  );


// =====================================
// USER APIs
// =====================================

// CREATE VOTER

export const createVoter = (
  formData
) =>
  API.post(
    "/voter",
    formData
  );

// GET MY VOTER

export const getMyVoter = () =>
  API.get("/voter/me");

// GET ALL VOTERS

export const getAllVoters =
  () => API.get("/voter/all");

// GET SINGLE VOTER

export const getSingleVoter = (
  id
) =>
  API.get(`/voter/${id}`);


// =====================================
// ADMIN DASHBOARD APIs
// =====================================

// DASHBOARD STATS

export const getDashboardStats =
  () =>
    API.get(
      "/admin/dashboard"
    );


// =====================================
// ADMIN CASE APIs
// =====================================

// GET ALL ACTIVE CASES

export const getAllCases =
  () =>
    API.get("/admin/cases");

// GET SUSPICIOUS CASES

export const getSuspiciousVoters =
  () =>
    API.get(
      "/admin/suspicious"
    );

// GET REVIEW CASES

export const getReviewVoters =
  () =>
    API.get(
      "/admin/review"
    );

// GET VERIFIED VOTERS

export const getVerifiedVoters =
  () =>
    API.get(
      "/admin/verified"
    );

// GET SINGLE CASE DETAILS

export const getSingleCase = (
  voterId
) =>
  API.get(
    `/admin/case/${voterId}`
  );

// SEARCH CASES

export const searchCases = (
  query
) =>
  API.get(
    `/admin/search?q=${query}`
  );


// =====================================
// ADMIN REVIEW APIs
// =====================================

// APPROVE / REJECT CASE

export const reviewVoterCase =
  (
    voterId,
    data
  ) =>
    API.put(
      `/admin/review/${voterId}`,
      data
    );


// =====================================
// LEGACY MANUAL VERIFY
// OPTIONAL
// =====================================

export const manualVerify = (
  id,
  classification
) =>
  API.put(
    `/admin/manual-verify/${id}`,
    {
      classification,
    }
  );


// =====================================
// EXPORT AXIOS INSTANCE
// =====================================

export default API;