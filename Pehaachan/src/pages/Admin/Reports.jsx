import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getDashboardStats,
  getVerifiedVoters,
  getSuspiciousVoters,
  getReviewVoters,
} from "../../services/api";
import dashboardStyles from "./AdminDashboard.module.css";

const Reports = () => {
  const { searchQuery } = useOutletContext();

  const [reportData, setReportData] = useState({
    isLoading: true,

    kpis: {
      accuracy: "-",
      accuracyTrend: "",
      turnaround: "-",
      turnaroundTrend: "",
      totalProcessed: 0,
      flaggedCases: 0,
    },

    reportsList: [],
  });

  // =====================================
  // FETCH REAL REPORT DATA
  // ORIGINAL PREMIUM UI PRESERVED
  // =====================================

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const statsRes =
          await getDashboardStats();

        const verifiedRes =
          await getVerifiedVoters();

        const suspiciousRes =
          await getSuspiciousVoters();

        const reviewRes =
          await getReviewVoters();

        const total =
          statsRes.data.stats
            ?.totalVoters || 0;

        const verified =
          statsRes.data.stats
            ?.verifiedVoters || 0;

        const suspicious =
          statsRes.data.stats
            ?.suspiciousVoters || 0;

        const review =
          statsRes.data.stats
            ?.reviewVoters || 0;

        // Verification Accuracy
        const accuracy =
          total > 0
            ? (
                (verified / total) *
                100
              ).toFixed(1)
            : 0;

        setReportData({
          isLoading: false,

          kpis: {
            accuracy: `${accuracy}%`,
            accuracyTrend: `${verified} verified successfully`,

            turnaround: `${
              review + suspicious
            } Cases`,
            turnaroundTrend:
              "Awaiting admin review",

            totalProcessed: total,
            flaggedCases:
              suspicious + review,
          },

          reportsList: [
            {
              title:
                "Verified Voters Report",
              type: "LIVE",
              date: new Date().toLocaleDateString(),
              size: `${
                verifiedRes.data.count ||
                0
              } Records`,
              status: "Healthy",
            },

            {
              title:
                "Suspicious Activity Report",
              type: "LIVE",
              date: new Date().toLocaleDateString(),
              size: `${
                suspiciousRes.data
                  .count || 0
              } Records`,
              status: "High Priority",
            },

            {
              title:
                "Manual Review Queue",
              type: "LIVE",
              date: new Date().toLocaleDateString(),
              size: `${
                reviewRes.data.count ||
                0
              } Records`,
              status: "Pending",
            },

            {
              title:
                "System Verification Audit",
              type: "AUTO",
              date: new Date().toLocaleDateString(),
              size: `${total} Total`,
              status: "Generated",
            },
          ],
        });
      } catch (error) {
        console.log(error);

        setReportData((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    fetchReportsData();
  }, []);

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredReports =
    reportData.reportsList.filter(
      (doc) =>
        doc.title
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        doc.status
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
    );

  return (
    <main
      className={
        dashboardStyles.mainContent
      }
      style={{
        padding: "2rem",
      }}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className={
          dashboardStyles.header
        }
      >
        <div>
          <h2
            className={
              dashboardStyles.pageTitle
            }
          >
            Analytics & Reports
          </h2>

          <p
            className={
              dashboardStyles.pageSubtitle
            }
          >
            Live analytics,
            system audits and
            verification reporting
            dashboard
          </p>
        </div>

        <button
          className={
            dashboardStyles.exportBtn
          }
        >
          Export Reports
        </button>
      </div>

      {/* =====================================
          KPI SUMMARY CARDS
      ===================================== */}

      <div
        className={
          dashboardStyles.metricGrid
        }
      >
        {/* Accuracy */}
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
            Verification Accuracy
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {reportData.isLoading
              ? "-"
              : reportData.kpis
                  .accuracy}
          </p>

          <p
            className={
              dashboardStyles.chartSubtitle
            }
          >
            {reportData.isLoading
              ? "Loading..."
              : reportData.kpis
                  .accuracyTrend}
          </p>
        </div>

        {/* Review Queue */}
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
            Review Queue
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {reportData.isLoading
              ? "-"
              : reportData.kpis
                  .turnaround}
          </p>

          <p
            className={
              dashboardStyles.chartSubtitle
            }
          >
            {reportData.isLoading
              ? "Loading..."
              : reportData.kpis
                  .turnaroundTrend}
          </p>
        </div>

        {/* Total Processed */}
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
            Total Processed
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {
              reportData.kpis
                .totalProcessed
            }
          </p>
        </div>

        {/* Flagged Cases */}
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
            Flagged Cases
          </h3>

          <p
            className={
              dashboardStyles.metricValue
            }
          >
            {
              reportData.kpis
                .flaggedCases
            }
          </p>
        </div>
      </div>

      {/* =====================================
          REPORTS TABLE
      ===================================== */}

      <div
        className={
          dashboardStyles.flagsSection
        }
        style={{
          marginTop: "2rem",
        }}
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
            Live Reports &
            System Logs
          </h3>
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            className={
              dashboardStyles.dataTable
            }
          >
            <thead>
              <tr>
                <th>
                  Report Name
                </th>
                <th>Type</th>
                <th>Date</th>
                <th>Records</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reportData.isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "3rem",
                    }}
                  >
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "3rem",
                    }}
                  >
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map(
                  (doc, i) => (
                    <tr
                      key={i}
                    >
                      <td>
                        {doc.title}
                      </td>

                      <td>
                        {doc.type}
                      </td>

                      <td>
                        {doc.date}
                      </td>

                      <td>
                        {doc.size}
                      </td>

                      <td>
                        {doc.status}
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

export default Reports;