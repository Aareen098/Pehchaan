import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VoterRegistry from "./pages/Admin/VoterRegistry";
import Cases from "./pages/Admin/Cases";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

import UserDashboard from "./pages/User/UserDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* =====================================
            PUBLIC ROUTES
        ===================================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* =====================================
            USER PROTECTED ROUTE
        ===================================== */}

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            ADMIN PROTECTED ROUTES
        ===================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="registry"
            element={<VoterRegistry />}
          />

          <Route
            path="cases"
            element={<Cases />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>


        {/* =====================================
            DEFAULT ROUTE
        ===================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;