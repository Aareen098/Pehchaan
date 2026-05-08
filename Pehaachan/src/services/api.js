import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


// =====================================
// AUTO ADD TOKEN TO EVERY REQUEST
// =====================================

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


// =====================================
// AUTH APIs
// =====================================

// Login
export const loginUser = (formData) =>
  API.post("/auth/login", formData);

// Register
export const registerUser = (formData) =>
  API.post("/auth/register", formData);


// =====================================
// USER APIs
// =====================================

// Submit voter form
export const createVoter = (formData) =>
  API.post("/voter", formData);

// Get logged-in user's voter details
export const getMyVoter = () =>
  API.get("/voter/me");


// =====================================
// ADMIN APIs
// =====================================

// Dashboard Stats
export const getDashboardStats = () =>
  API.get("/admin/dashboard");

// Suspicious Voters
export const getSuspiciousVoters = () =>
  API.get("/admin/suspicious");

// Review Required
export const getReviewVoters = () =>
  API.get("/admin/review");

// Verified Voters
export const getVerifiedVoters = () =>
  API.get("/admin/verified");

// Manual Override
export const manualVerify = (id, classification) =>
  API.put(`/admin/manual-verify/${id}`, {
    classification,
  });

// Get ALL voters
export const getAllVoters = () =>
  API.get("/voter/all");

// Get single voter by ID
export const getSingleVoter = (id) =>
  API.get(`/voter/${id}`);

export default API;