import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRole,
}) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // Access allowed
  return children;
};

export default ProtectedRoute;