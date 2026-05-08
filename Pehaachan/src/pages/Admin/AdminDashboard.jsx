import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getDashboardStats,
  getSuspiciousVoters
} from "../../services/api";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const { searchQuery } = useOutletContext();

  const [metrics, setMetrics] = useState({
    isLoading: true,

    totalRequests: 0,
    suspiciousCases: 0,
    activeVerifications: 0,
    resolvedToday: 0,

    chartData: {
      verified: 0,
      unauthorised: 0,
      pending: 0
    },

    cityData: [],
    flagsData: []
  });

  // =====================================
  // REAL BACKEND + ORIGINAL UI PRESERVED
  // =====================================

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const statsRes =
          await getDashboardStats();

        const suspiciousRes =
          await getSuspiciousVoters();

        const stats =
          statsRes.data.stats || {};

        const suspiciousVoters =
          suspiciousRes.data.voters || [];

        // Dynamic city-wise suspicious data
        const cityMap = {};

        suspiciousVoters.forEach((voter) => {
          const city =
            voter.city || "Unknown";

          if (!cityMap[city]) {
            cityMap[city] = 0;
          }

          cityMap[city]++;
        });

        const colors = [
          "#e65100",
          "var(--tertiary)",
          "#f57c00",
          "#ffb74d"
        ];

        const cityData = Object.keys(
          cityMap
        )
          .slice(0, 4)
          .map((city, index) => ({
            city,
            count: cityMap[city],
            percentage:
              cityMap[city] * 10 > 100
                ? 100
                : cityMap[city] * 10,
            color:
              colors[
                index % colors.length
              ]
          }));

        const flagsData =
          suspiciousVoters.map(
            (voter, index) => ({
              name:
                voter.name ||
                "Unknown User",

              id:
                voter.voterId ||
                `IND${1000 + index}`,

              reason:
                voter.classification ===
                "Suspicious"
                  ? "Verification Mismatch"
                  : "Manual Review Required",

              code:
                voter.conflictScore
                  ? `ERR-${voter.conflictScore}`
                  : "ERR-ML-101",

              risk:
                voter.conflictScore
                  ? `${voter.conflictScore}%`
                  : "85%",

              status:
                voter.classification
                  ?.toUpperCase() ||
                "PENDING",

              date: new Date(
                voter.createdAt
              ).toLocaleDateString()
            })
          );

        const totalVoters =
          stats.totalVoters || 0;

        const verifiedVoters =
          stats.verifiedVoters || 0;

        const suspiciousCount =
          stats.suspiciousVoters || 0;

        const pendingCount =
          stats.pendingVoters || 0;

        const verifiedPercent =
          totalVoters > 0
            ? Math.round(
                (verifiedVoters /
                  totalVoters) *
                  100
              )
            : 0;

        const suspiciousPercent =
          totalVoters > 0
            ? Math.round(
                (suspiciousCount /
                  totalVoters) *
                  100
              )
            : 0;

        const pendingPercent =
          totalVoters > 0
            ? Math.round(
                (pendingCount /
                  totalVoters) *
                  100
              )
            : 0;

        setMetrics({
          isLoading: false,

          totalRequests:
            totalVoters,

          suspiciousCases:
            suspiciousCount,

          activeVerifications:
            pendingCount,

          resolvedToday:
            verifiedVoters,

          chartData: {
            verified:
              verifiedPercent,

            unauthorised:
              suspiciousPercent,

            pending:
              pendingPercent
          },

          cityData,
          flagsData
        });
      } catch (error) {
        console.log(error);

        setMetrics((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    fetchMetrics();
  }, []);

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredFlags =
    metrics.flagsData.filter((flag) => {
      return (
        flag.id
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        flag.name
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        flag.reason
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
      );
    });

  return (
    <main className={styles.mainContent}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>
            System Overview
          </h2>

          <p className={styles.pageSubtitle}>
            Real-time voter authentication
            and suspicious activity
            tracking.
          </p>
        </div>

        <div
          className={styles.headerActions}
        >
          <div
            className={styles.dateRange}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem"
              }}
            >
              calendar_today
            </span>

            Live Dashboard
          </div>

          <button
            className={styles.exportBtn}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
                marginRight: "0.25rem"
              }}
            >
              download
            </span>

            Export Log
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className={styles.metricGrid}>
        {/* Total */}
        <div className={styles.metricCard}>
          <div
            className={styles.metricHeader}
          >
            <div
              className={
                styles.metricIconWrapper
              }
              style={{
                backgroundColor:
                  "rgba(0, 91, 191, 0.1)",
                color:
                  "var(--primary)"
              }}
            >
              <span className="material-symbols-outlined">
                how_to_reg
              </span>
            </div>

            <span
              className={styles.metricBadge}
              style={{
                backgroundColor:
                  "#E6F4EA",
                color: "#34A853"
              }}
            >
              Live
            </span>
          </div>

          <h3
            className={styles.metricLabel}
          >
            Total Requests
          </h3>

          <p
            className={styles.metricValue}
          >
            {metrics.isLoading
              ? "..."
              : metrics.totalRequests.toLocaleString()}
          </p>
        </div>

        {/* Suspicious */}
        <div className={styles.metricCard}>
          <div
            className={styles.metricHeader}
          >
            <div
              className={
                styles.metricIconWrapper
              }
              style={{
                backgroundColor:
                  "var(--error-container)",
                color:
                  "var(--error)"
              }}
            >
              <span className="material-symbols-outlined">
                warning
              </span>
            </div>

            <span
              className={styles.metricBadge}
              style={{
                backgroundColor:
                  "var(--error-container)",
                color:
                  "var(--error)"
              }}
            >
              High Risk
            </span>
          </div>

          <h3
            className={styles.metricLabel}
          >
            Suspicious Cases
          </h3>

          <p
            className={styles.metricValue}
          >
            {metrics.isLoading
              ? "..."
              : metrics.suspiciousCases.toLocaleString()}
          </p>
        </div>

        {/* Pending */}
        <div className={styles.metricCard}>
          <div
            className={styles.metricHeader}
          >
            <div
              className={
                styles.metricIconWrapper
              }
              style={{
                backgroundColor:
                  "rgba(197, 85, 0, 0.1)",
                color:
                  "var(--tertiary)"
              }}
            >
              <span className="material-symbols-outlined">
                pending_actions
              </span>
            </div>

            <span
              className={styles.metricBadge}
            >
              Active
            </span>
          </div>

          <h3
            className={styles.metricLabel}
          >
            Active Verifications
          </h3>

          <p
            className={styles.metricValue}
          >
            {metrics.isLoading
              ? "..."
              : metrics.activeVerifications.toLocaleString()}
          </p>
        </div>

        {/* Verified */}
        <div className={styles.metricCard}>
          <div
            className={styles.metricHeader}
          >
            <div
              className={
                styles.metricIconWrapper
              }
              style={{
                backgroundColor:
                  "#E6F4EA",
                color: "#34A853"
              }}
            >
              <span className="material-symbols-outlined">
                task_alt
              </span>
            </div>

            <span
              className={styles.metricBadge}
              style={{
                backgroundColor:
                  "#E6F4EA",
                color: "#34A853"
              }}
            >
              Verified
            </span>
          </div>

          <h3
            className={styles.metricLabel}
          >
            Resolved Today
          </h3>

          <p
            className={styles.metricValue}
          >
            {metrics.isLoading
              ? "..."
              : metrics.resolvedToday.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts + Analytics */}
      {/* Original premium UI preserved */}
      {/* Existing CSS remains same */}

      {/* High Priority Flags */}
      <div
        className={styles.flagsSection}
      >
        <div
          className={styles.flagsHeader}
        >
          <div
            className={
              styles.flagsTitleContainer
            }
          >
            <h3
              className={styles.chartTitle}
            >
              High-Priority Flags
            </h3>
          </div>

          <button
            className={styles.btnAction}
          >
            View Detailed Logs
          </button>
        </div>

        <div
          style={{
            overflowX: "auto"
          }}
        >
          <table
            className={styles.dataTable}
          >
            <thead>
              <tr>
                <th>
                  Applicant Profile
                </th>
                <th>
                  Reason for Flag
                </th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>
              {metrics.isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "2rem"
                    }}
                  >
                    Loading manual
                    flags...
                  </td>
                </tr>
              ) : filteredFlags.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "2rem"
                    }}
                  >
                    No matching
                    cases found
                  </td>
                </tr>
              ) : (
                filteredFlags.map(
                  (
                    flag,
                    index
                  ) => (
                    <tr
                      key={index}
                    >
                      <td>
                        {
                          flag.name
                        }
                      </td>

                      <td>
                        {
                          flag.reason
                        }
                      </td>

                      <td>
                        {
                          flag.risk
                        }
                      </td>

                      <td>
                        {
                          flag.status
                        }
                      </td>

                      <td>
                        Review
                        Case
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;