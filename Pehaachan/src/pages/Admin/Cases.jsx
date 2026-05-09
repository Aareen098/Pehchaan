// src/pages/admin/Cases.jsx

import React, {
  useState,
  useEffect,
} from "react";

import { useOutletContext } from "react-router-dom";

import {
  getAllCases,
  getSingleCase,
  reviewVoterCase,
} from "../../services/api";

import dashboardStyles from "./AdminDashboard.module.css";
import styles from "./Cases.module.css";


/* ───────────────────────────────────── */
/* ICONS */
/* ───────────────────────────────────── */

const IconAlert = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />

    <line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
    />

    <line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
    />
  </svg>
);

const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />

    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconArrowLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="19"
      y1="12"
      x2="5"
      y2="12"
    />

    <polyline points="12 19 5 12 12 5" />
  </svg>
);


/* ───────────────────────────────────── */
/* REJECTION REASONS */
/* ───────────────────────────────────── */

const rejectionReasons = [
  "Select a reason…",
  "Insufficient documentation",
  "Data does not match records",
  "Duplicate application detected",
  "Fraudulent submission suspected",
  "Applicant not traceable",
];


/* ═════════════════════════════════════ */
/* MANUAL REVIEW PANEL */
/* ═════════════════════════════════════ */

const ManualReviewPanel = ({
  caseRow,
  onBack,
  refreshCases,
}) => {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [notes, setNotes] =
    useState("");

  const [reason, setReason] =
    useState(rejectionReasons[0]);

  const [decision, setDecision] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);


  // FETCH CASE DETAILS

  useEffect(() => {
    fetchCaseDetails();
  }, []);


  const fetchCaseDetails = async () => {
    try {
      setLoading(true);

      const res =
        await getSingleCase(
          caseRow.id
        );

      setData(res.data.voter);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  // HANDLE APPROVE / REJECT

  const handleDecision = async (
    action
  ) => {
    try {
      setActionLoading(true);

      await reviewVoterCase(
        caseRow.id,
        {
          action,
          notes,
          reason,
        }
      );

      setDecision(
        action === "approve"
          ? "approved"
          : "rejected"
      );

      await refreshCases();
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoading(false);
    }
  };


  // LOADING

  if (loading) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
        }}
      >
        Loading case details...
      </div>
    );
  }


  // NO DATA

  if (!data) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
        }}
      >
        Case not found
      </div>
    );
  }


  // SUCCESS SCREEN

  if (decision) {
    return (
      <div className={styles.decisionScreen}>
        <div
          className={`${styles.decisionCard} ${
            decision === "approved"
              ? styles.decisionApproved
              : styles.decisionRejected
          }`}
        >
          <div className={styles.decisionIcon}>
            {decision === "approved" ? (
              <IconCheck />
            ) : (
              <IconX />
            )}
          </div>

          <h3>
            {decision === "approved"
              ? "Verification Approved"
              : "Case Rejected"}
          </h3>

          <p>
            Your decision has been
            successfully logged into
            the audit trail.
          </p>

          <button
            className={styles.backBtn}
            onClick={onBack}
          >
            <IconArrowLeft />
            Return to Cases
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.reviewRoot}>
      {/* BREADCRUMB */}

      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={onBack}
        >
          Cases
        </button>

        <span className={styles.breadcrumbSep}>
          ›
        </span>

        <span className={styles.breadcrumbLink}>
          Manual Review
        </span>

        <span className={styles.breadcrumbSep}>
          ›
        </span>

        <span className={styles.breadcrumbActive}>
          Case #{data.voterId}
        </span>
      </div>


      {/* PAGE HEADING */}

      <div className={styles.reviewHeading}>
        <div>
          <h2 className={styles.reviewTitle}>
            Manual Case Review
          </h2>

          <div className={styles.reviewMeta}>
            <span
              className={styles.applicantName}
            >
              {data.name}
            </span>

            <span
              className={styles.statusBadge}
            >
              {data.classification}
            </span>
          </div>
        </div>

        <div className={styles.assignedTo}>
          <span
            className={styles.assignedLabel}
          >
            USER EMAIL
          </span>

          <span
            className={styles.assignedName}
          >
            {data.userId?.email}
          </span>
        </div>
      </div>


      {/* MAIN CONTENT */}

      <div className={styles.reviewColumns}>
        {/* LEFT SECTION */}

        <div className={styles.reviewLeft}>
          {/* ALERT BOX */}

          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>
              <IconAlert />
            </div>

            <div className={styles.alertContent}>
              <h4
                className={styles.alertTitle}
              >
                Critical Discrepancies Found
              </h4>

              <p className={styles.alertText}>
                ML engine detected
                inconsistencies requiring
                manual verification.
              </p>

              <div className={styles.alertTags}>
                {data.discrepancies?.length >
                0 ? (
                  data.discrepancies.map(
                    (d, i) => (
                      <span
                        key={i}
                        className={styles.alertTag}
                      >
                        {d}
                      </span>
                    )
                  )
                ) : (
                  <span
                    className={styles.alertTag}
                  >
                    No discrepancies found
                  </span>
                )}
              </div>
            </div>
          </div>


          {/* COMPARISON TABLE */}

          <div className={styles.comparisonCard}>
            <div
              className={
                styles.comparisonHeader
              }
            >
              <span
                className={
                  styles.comparisonTitle
                }
              >
                SIDE-BY-SIDE COMPARISON
              </span>

              <span
                className={
                  styles.comparisonBadge
                }
              >
                ML GENERATED
              </span>
            </div>

            <table
              className={
                styles.comparisonTable
              }
            >
              <thead>
                <tr>
                  <th>
                    FIELD ATTRIBUTE
                  </th>

                  <th>
                    SUBMITTED DATA
                  </th>

                  <th>
                    MASTER REGISTRY
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.comparisonData
                  ?.length > 0 ? (
                  data.comparisonData.map(
                    (row, i) => (
                      <tr
                        key={i}
                        className={
                          row.mismatch
                            ? styles.mismatchRow
                            : ""
                        }
                      >
                        <td
                          className={
                            styles.fieldCell
                          }
                        >
                          {row.field}
                        </td>

                        <td
                          className={
                            row.mismatch
                              ? styles.mismatchValue
                              : styles.matchValue
                          }
                        >
                          {row.submitted}
                        </td>

                        <td
                          className={
                            styles.systemValue
                          }
                        >
                          {row.system}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign:
                          "center",
                        padding: "2rem",
                      }}
                    >
                      No comparison data
                      available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* RIGHT ACTION PANEL */}

        <div className={styles.actionPanel}>
          <h3 className={styles.actionTitle}>
            Verification Action
          </h3>


          {/* NOTES */}

          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
            >
              INTERNAL NOTES
            </label>

            <textarea
              className={styles.notesArea}
              placeholder="Mention observations regarding this case..."
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows={5}
            />
          </div>


          {/* REJECTION REASON */}

          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
            >
              REJECTION REASON
            </label>

            <select
              className={styles.reasonSelect}
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
            >
              {rejectionReasons.map(
                (r) => (
                  <option key={r}>
                    {r}
                  </option>
                )
              )}
            </select>
          </div>


          {/* APPROVE */}

          <button
            className={styles.btnApprove}
            disabled={actionLoading}
            onClick={() =>
              handleDecision(
                "approve"
              )
            }
          >
            <IconCheck />

            {actionLoading
              ? "Processing..."
              : "Approve Verification"}
          </button>


          {/* REJECT */}

          <button
            className={styles.btnReject}
            disabled={actionLoading}
            onClick={() =>
              handleDecision(
                "reject"
              )
            }
          >
            <IconX />

            {actionLoading
              ? "Processing..."
              : "Reject Case"}
          </button>


          {/* REVIEW CONTEXT */}

          <div className={styles.reviewContext}>
            <span
              className={styles.contextTitle}
            >
              REVIEW CONTEXT
            </span>

            <div className={styles.contextRow}>
              <span>
                Conflict Score
              </span>

              <strong>
                {data.conflictScore}
              </strong>
            </div>

            <div className={styles.contextRow}>
              <span>State</span>

              <strong>
                {data.state}
              </strong>
            </div>

            <div className={styles.contextRow}>
              <span>City</span>

              <strong>
                {data.city}
              </strong>
            </div>

            <div className={styles.contextRow}>
              <span>
                Submitted
              </span>

              <strong>
                {new Date(
                  data.createdAt
                ).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ═════════════════════════════════════ */
/* MAIN COMPONENT */
/* ═════════════════════════════════════ */

const Cases = () => {
  const { searchQuery } =
    useOutletContext();

  const [activeTab, setActiveTab] =
    useState("All");

  const [casesData, setCasesData] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [reviewingCase, setReviewingCase] =
    useState(null);

  const [summary, setSummary] =
    useState({
      totalCases: 0,
      pendingCases: 0,
      unauthorisedCases: 0,
    });


  // FETCH CASES

  const fetchCases = async () => {
    try {
      setIsLoading(true);

      const res =
        await getAllCases();

      const voters =
        res?.data?.voters || [];

      const formattedCases =
        voters.map((voter) => ({
          id: voter._id,

          displayId:
            voter.voterId,

          name: voter.name,

          type:
            voter.classification ===
            "Review"
              ? "Manual Review Required"
              : "Suspicious Verification",

          priority:
            voter.conflictScore >=
            80
              ? "High"
              : voter.conflictScore >=
                50
              ? "Medium"
              : "Low",

          date: new Date(
            voter.createdAt
          ).toLocaleDateString(),

          status:
            voter.classification ===
            "Review"
              ? "Pending"
              : "Unauthorised",
        }));

      setCasesData(formattedCases);

      setSummary({
        totalCases:
          formattedCases.length,

        pendingCases:
          formattedCases.filter(
            (c) =>
              c.status ===
              "Pending"
          ).length,

        unauthorisedCases:
          formattedCases.filter(
            (c) =>
              c.status ===
              "Unauthorised"
          ).length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCases();
  }, []);


  // FILTER LOGIC

  const filteredCases =
    casesData.filter(
      (c) =>
        (activeTab === "All" ||
          c.status === activeTab) &&
        (c.name
          ?.toLowerCase()
          .includes(
            (
              searchQuery || ""
            ).toLowerCase()
          ) ||
          c.displayId
            ?.toLowerCase()
            .includes(
              (
                searchQuery || ""
              ).toLowerCase()
            ))
    );


  // OPEN REVIEW PANEL

  if (reviewingCase) {
    return (
      <main
        className={
          dashboardStyles.mainContent
        }
        style={{ padding: "2rem" }}
      >
        <ManualReviewPanel
          caseRow={reviewingCase}
          onBack={() =>
            setReviewingCase(null)
          }
          refreshCases={fetchCases}
        />
      </main>
    );
  }


  return (
    <main
      className={
        dashboardStyles.mainContent
      }
      style={{ padding: "2rem" }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
            }}
          >
            Case Management
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#555",
              fontSize: "1.1rem",
            }}
          >
            Review and manage
            flagged voter
            applications with ML
            assisted fraud detection.
          </p>
        </div>
      </div>


      {/* SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h4>Total Cases</h4>

          <h1>
            {summary.totalCases}
          </h1>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h4>Pending Review</h4>

          <h1>
            {summary.pendingCases}
          </h1>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h4>Unauthorised</h4>

          <h1>
            {
              summary.unauthorisedCases
            }
          </h1>
        </div>
      </div>


      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom:
            "1px solid #ddd",
          marginBottom: "2rem",
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
              padding: "1rem 0",
              border: "none",
              background: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
              color:
                activeTab === tab
                  ? "#2563eb"
                  : "#555",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* TABLE */}

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom:
              "1px solid #eee",
          }}
        >
          <h2>
            Investigation Queue
          </h2>
        </div>

        <div
          style={{ overflowX: "auto" }}
        >
          <table
            className={
              dashboardStyles.dataTable
            }
          >
            <thead>
              <tr>
                <th>CASE ID</th>
                <th>
                  APPLICANT NAME
                </th>
                <th>FLAG TYPE</th>
                <th>PRIORITY</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>REVIEW</th>
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
                    Loading cases...
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
                      <td>
                        {c.displayId}
                      </td>

                      <td>{c.name}</td>

                      <td>{c.type}</td>

                      <td>
                        {c.priority}
                      </td>

                      <td>{c.date}</td>

                      <td>{c.status}</td>

                      <td>
                        <button
                          style={{
                            background:
                              "#0057d9",
                            color:
                              "white",
                            border:
                              "none",
                            padding:
                              "0.5rem 1rem",
                            borderRadius:
                              "20px",
                            cursor:
                              "pointer",
                            fontWeight:
                              "600",
                          }}
                          onClick={() =>
                            setReviewingCase(
                              c
                            )
                          }
                        >
                          Review
                        </button>
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