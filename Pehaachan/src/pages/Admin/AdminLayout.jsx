import React, { useState } from "react";
import {
  useNavigate,
  Link,
  useLocation,
  Outlet,
} from "react-router-dom";
import dashboardStyles from "./AdminDashboard.module.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const currentPath = location.pathname;

  const notifications = [
    "New suspicious voter detected",
    "3 manual review requests pending",
    "Verification report updated",
  ];

  return (
    <div className={dashboardStyles.pageContainer}>
      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className={dashboardStyles.sidebar}>
        {/* Sidebar Header */}
        <div className={dashboardStyles.sidebarHeader}>
          <h1
            className={dashboardStyles.sidebarTitle}
            style={{
              color: "var(--primary)",
              fontSize: "1.4rem",
              fontWeight: "800",
            }}
          >
            Pehchaan Admin
          </h1>

          {/* Restored Premium Admin Card */}
          <div
            style={{
              padding: "1rem",
              background:
                "linear-gradient(135deg, rgba(0,91,191,0.08), rgba(0,91,191,0.02))",
              borderRadius: "0.75rem",
              marginTop: "1rem",
              border:
                "1px solid rgba(0,91,191,0.08)",
            }}
          >
            <p
              style={{
                fontWeight: "700",
                margin: 0,
                fontSize: "0.95rem",
              }}
            >
              Registry Admin
            </p>

            <p
              style={{
                fontSize: "0.75rem",
                margin: "0.35rem 0 0 0",
                color:
                  "var(--on-surface-variant)",
              }}
            >
              Voter Management Division
            </p>
          </div>
        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav
          className={dashboardStyles.nav}
          style={{
            marginTop: "1.5rem",
          }}
        >
          <Link
            to="/admin"
            className={`${dashboardStyles.navItem} ${
              currentPath === "/admin"
                ? dashboardStyles.active
                : ""
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/cases"
            className={`${dashboardStyles.navItem} ${
              currentPath === "/admin/cases"
                ? dashboardStyles.active
                : ""
            }`}
          >
            Cases
          </Link>

          <Link
            to="/admin/reports"
            className={`${dashboardStyles.navItem} ${
              currentPath === "/admin/reports"
                ? dashboardStyles.active
                : ""
            }`}
          >
            Reports
          </Link>

          <Link
            to="/admin/registry"
            className={`${dashboardStyles.navItem} ${
              currentPath === "/admin/registry"
                ? dashboardStyles.active
                : ""
            }`}
          >
            Voter Registry
          </Link>

          <Link
            to="/admin/settings"
            className={`${dashboardStyles.navItem} ${
              currentPath === "/admin/settings"
                ? dashboardStyles.active
                : ""
            }`}
          >
            Settings
          </Link>
        </nav>

        {/* =====================================
            FOOTER
        ===================================== */}

        <div
          className={dashboardStyles.sidebarFooter}
          style={{
            marginTop: "auto",
            paddingTop: "2rem",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor:
                "transparent",
              border:
                "1px solid var(--outline-variant)",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: "700",
              transition: "0.2s ease",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================
          TOPBAR
      ===================================== */}

      <header className={dashboardStyles.topbar}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor:
              "var(--surface-container-high)",
            padding: "0.75rem 1rem",
            borderRadius: "2rem",
            width: "380px",
            border:
              "1px solid var(--outline-variant)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              marginRight: "0.6rem",
              fontSize: "1.1rem",
              color:
                "var(--on-surface-variant)",
            }}
          >
            search
          </span>

          <input
            type="text"
            placeholder="Search voters, cases, reports..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.95rem",
            }}
          />
        </div>

        {/* =====================================
            RIGHT ACTIONS
        ===================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Notifications */}
          <div
            style={{
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowNotifications(
                  !showNotifications
                );
                setShowProfileMenu(false);
              }}
              style={{
                background:
                  "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              🔔
            </button>

            {showNotifications && (
              <div
                className={
                  dashboardStyles.dropdownMenu
                }
              >
                <div
                  className={
                    dashboardStyles.dropdownHeader
                  }
                >
                  Notifications
                </div>

                <div
                  className={
                    dashboardStyles.dropdownList
                  }
                >
                  {notifications.map(
                    (item, index) => (
                      <div
                        key={index}
                        className={
                          dashboardStyles.dropdownItem
                        }
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div
            style={{
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowProfileMenu(
                  !showProfileMenu
                );
                setShowNotifications(false);
              }}
              style={{
                background:
                  "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.95rem",
              }}
            >
              Admin ⚙️
            </button>

            {showProfileMenu && (
              <div
                className={
                  dashboardStyles.dropdownMenu
                }
                style={{
                  right: 0,
                }}
              >
                <Link
                  to="/admin/settings"
                  className={
                    dashboardStyles.userMenuItem
                  }
                  onClick={() =>
                    setShowProfileMenu(false)
                  }
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className={
                    dashboardStyles.userMenuItem
                  }
                  style={{
                    color: "red",
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <Outlet
        context={{
          searchQuery,
        }}
      />
    </div>
  );
};

export default AdminLayout;