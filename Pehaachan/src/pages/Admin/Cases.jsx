import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getReviewVoters,
  getSuspiciousVoters,
} from "../../services/api";
import dashboardStyles from "./AdminDashboard.module.css";

const Cases = () => {
  const { searchQuery } = useOutletContext();

  const [activeTab, setActiveTab] = useState("Pending");
  const [casesData, setCasesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalCases: 0,
    pendingCases: 0,
    unauthorisedCases: 0,
  });

  // =====================================
  // FETCH REAL CASES DATA
  // =====================================

  useEffect(() => {
    const fetchCasesData = async () => {
      try {
        setIsLoading(true);

        const reviewRes = await getReviewVoters();
        const suspiciousRes = await getSuspiciousVoters();

        // Debug logs (very important)
        console.log("Review Response:", reviewRes);
        console.log("Suspicious Response:", suspiciousRes);

        /*
          Supports BOTH formats:

          1. { voters: [...] }

          2. [ ... ]
        */

        const reviewVoters =
          reviewRes?.data?.voters || reviewRes?.data || [];

        const suspiciousVoters =
          suspiciousRes?.data?.voters ||
          suspiciousRes?.data ||
          [];

        // =====================================
        // REVIEW CASES → Pending
        // =====================================

        const reviewCases = reviewVoters.map(
          (voter, index) => ({
            id:
              voter.voterId ||
              voter._id ||
              `REV-${1000 + index}`,

            name:
              voter.name || "Unknown User",

            type: "Manual Review Required",

            date: voter.createdAt
              ? new Date(
                  voter.createdAt
                ).toLocaleDateString()
              : "N/A",

            status: "Pending",

            priority: "Medium",

            reason:
              "Document mismatch / verification review",
          })
        );

        // =====================================
        // SUSPICIOUS CASES → Unauthorised
        // =====================================

        const suspiciousCases =
          suspiciousVoters.map(
            (voter, index) => ({
              id:
                voter.voterId ||
                voter._id ||
                `SUS-${2000 + index}`,

              name:
                voter.name || "Unknown User",

              type:
                "Suspicious Verification",

              date: voter.createdAt
                ? new Date(
                    voter.createdAt
                  ).toLocaleDateString()
                : "N/A",

              status: "Unauthorised",

              priority: "High",

              reason:
                "Fraud detection / duplicate / ML conflict",
            })
          );

        // =====================================
        // MERGE BOTH
        // =====================================

        const mergedCases = [
          ...reviewCases,
          ...suspiciousCases,
        ];

        setCasesData(mergedCases);

        setSummary({
          totalCases: mergedCases.length,
          pendingCases: reviewCases.length,
          unauthorisedCases:
            suspiciousCases.length,
        });
      } catch (error) {
        console.log("FULL ERROR:", error);

        console.log(
          "Backend Response:",
          error?.response?.data
        );

        console.log(
          "Status Code:",
          error?.response?.status
        );

        setCasesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasesData();
  }, []);

  // =====================================
  // FILTER LOGIC
  // =====================================

  const filteredCases = casesData.filter(
    (c) =>
      (activeTab === "All" ||
        c.status === activeTab) &&
      (
        c.id
          ?.toLowerCase()
          .includes(
            (searchQuery || "").toLowerCase()
          ) ||
        c.name
          ?.toLowerCase()
          .includes(
            (searchQuery || "").toLowerCase()
          ) ||
        c.type
          ?.toLowerCase()
          .includes(
            (searchQuery || "").toLowerCase()
          )
      )
  );

  return (
    <main
      className={dashboardStyles.mainContent}
      style={{ padding: "2rem" }}
    >
      {/* HEADER */}

      <div className={dashboardStyles.header}>
        <div>
          <h2
            className={
              dashboardStyles.pageTitle
            }
          >
            Case Management
          </h2>

          <p
            className={
              dashboardStyles.pageSubtitle
            }
          >
            Review and manage flagged
            voter applications with ML
            assisted fraud detection.
          </p>
        </div>

        <button
          className={
            dashboardStyles.exportBtn
          }
        >
          Export Cases
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div
        className={
          dashboardStyles.metricGrid
        }
      >
        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h3
            className={
              dashboardStyles.metricLabel
            }
          >
            Total Cases
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {summary.totalCases}
          </p>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h3
            className={
              dashboardStyles.metricLabel
            }
          >
            Pending Review
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {summary.pendingCases}
          </p>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h3
            className={
              dashboardStyles.metricLabel
            }
          >
            Unauthorised
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {
              summary.unauthorisedCases
            }
          </p>
        </div>
      </div>

      {/* FILTER TABS */}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          borderBottom:
            "1px solid var(--outline-variant)",
          marginBottom: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        {[
          "All",
          "Pending",
          "Unauthorised",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            style={{
              padding: "0.75rem 1rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              color:
                activeTab === tab
                  ? "var(--primary)"
                  : "var(--on-surface-variant)",
              fontWeight:
                activeTab === tab
                  ? "700"
                  : "600",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CASES TABLE */}

      <div
        className={
          dashboardStyles.flagsSection
        }
      >
        <div
          className={
            dashboardStyles.flagsHeader
          }
        >
          <h3
            className={
              dashboardStyles.chartTitle
            }
          >
            Investigation Queue
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            className={
              dashboardStyles.dataTable
            }
          >
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Applicant Name</th>
                <th>Flag Type</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding: "3rem",
                    }}
                  >
                    Loading cases from
                    database...
                  </td>
                </tr>
              ) : filteredCases.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding: "3rem",
                    }}
                  >
                    No matching cases
                    found
                  </td>
                </tr>
              ) : (
                filteredCases.map(
                  (c, index) => (
                    <tr key={index}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.type}</td>
                      <td>{c.priority}</td>
                      <td>{c.date}</td>
                      <td>{c.status}</td>
                      <td>
                        <span
                          style={{
                            color:
                              "var(--primary)",
                            fontWeight:
                              "700",
                            cursor:
                              "pointer",
                          }}
                        >
                          Review Case
                        </span>
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

export default Cases;