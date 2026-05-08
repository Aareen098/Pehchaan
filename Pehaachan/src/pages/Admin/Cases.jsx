import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getReviewVoters,
  getSuspiciousVoters,
} from "../../services/api";

import dashboardStyles from "./AdminDashboard.module.css";
import styles from "./Cases.module.css";

/* ── Lucide-style inline SVGs ─────────────────────────── */
const IconAlert = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ── Mock review data keyed by case id ────────────────── */
const reviewData = {
  'REV-1000': {
    name: 'Rahul Malhotra', caseId: 'REV-1000', status: 'NEEDS REVIEW',
    discrepancies: ['Biometric Mismatch – 92% Confidence', 'Photo Inconsistency'],
    comparison: [
      { field: 'Name', submitted: 'Rahul Malhotra', system: 'Rahul Kumar Malhotra', mismatch: false },
      { field: 'DOB', submitted: '12/08/1990', system: '12/08/1987', mismatch: true },
      { field: 'Biometric ID', submitted: 'BIO-XXXX-7721', system: 'BIO-XXXX-7761', mismatch: true },
      { field: 'Address', submitted: 'B-12, Saket, New Delhi 110017', system: '12, Saket Block-B, New Delhi 110017', mismatch: false },
    ],
    assignedTo: 'Senior Ombudsman Roy', queueTime: '2h 48m', priority: 'High', category: 'General – Phase 1',
  },
  'REV-1001': {
    name: 'Priya Sundaram', caseId: 'REV-1001', status: 'NEEDS REVIEW',
    discrepancies: ['Address Verification Failed – 78% Confidence'],
    comparison: [
      { field: 'Name', submitted: 'Priya Sundaram', system: 'Priya R. Sundaram', mismatch: false },
      { field: 'DOB', submitted: '03/11/1994', system: '03/11/1994', mismatch: false },
      { field: 'Address', submitted: 'Flat 8, Marina Apts, Chennai 28', system: '8, Marina Apartments, Chennai 600028', mismatch: true },
    ],
    assignedTo: 'Junior Officer Mehra', queueTime: '1h 05m', priority: 'Medium', category: 'Urban – Phase 2',
  },
  'SUS-2000': {
    name: 'Vikram Sethi', caseId: 'SUS-2000', status: 'NEEDS REVIEW',
    discrepancies: ['Duplicate Entry – 97% Confidence', 'DOB Inconsistency'],
    comparison: [
      { field: 'Name', submitted: 'Vikram Sethi', system: 'Vikram P. Sethi', mismatch: false },
      { field: 'DOB', submitted: '22/05/1985', system: '22/05/1983', mismatch: true },
      { field: 'Aadhaar Number', submitted: 'XXXX-XXXX-9910', system: 'XXXX-XXXX-9910', mismatch: false },
      { field: 'Voter ID', submitted: 'VID-UP-22-5511', system: 'VID-UP-22-5512', mismatch: true },
    ],
    assignedTo: 'Senior Ombudsman Roy', queueTime: '4h 22m', priority: 'High', category: 'General – Phase 1',
  },
};

const rejectionReasons = [
  'Select a reason…',
  'Insufficient documentation',
  'Data does not match records',
  'Duplicate application detected',
  'Fraudulent submission suspected',
  'Applicant not traceable',
];

/* ══════════════════════════════════════════════════════════
   Manual Review Panel
═══════════════════════════════════════════════════════════ */
const ManualReviewPanel = ({ caseRow, onBack }) => {
  const data = reviewData[caseRow.id] ?? {
    name: caseRow.name, caseId: caseRow.id, status: caseRow.status.toUpperCase(),
    discrepancies: [caseRow.type],
    comparison: [{ field: 'Flag Type', submitted: caseRow.type, system: '—', mismatch: true }],
    assignedTo: 'Senior Ombudsman Roy', queueTime: '—', priority: caseRow.priority, category: '—',
  };

  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState(rejectionReasons[0]);
  const [decision, setDecision] = useState(null); // 'approved' | 'rejected'

  if (decision) {
    return (
      <div className={styles.decisionScreen}>
        <div className={`${styles.decisionCard} ${decision === 'approved' ? styles.decisionApproved : styles.decisionRejected}`}>
          <div className={styles.decisionIcon}>
            {decision === 'approved' ? <IconCheck /> : <IconX />}
          </div>
          <h3>{decision === 'approved' ? 'Verification Approved' : 'Case Rejected'}</h3>
          <p>Your decision has been logged to the permanent audit trail with your digital signature ID #{data.caseId}-SECURE.</p>
          <button className={styles.backBtn} onClick={onBack}>
            <IconArrowLeft /> Return to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewRoot}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={onBack}>Cases</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbLink}>Manual Review</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbActive}>Case #{data.caseId}</span>
      </div>

      {/* ── Page heading ── */}
      <div className={styles.reviewHeading}>
        <div>
          <h2 className={styles.reviewTitle}>Manual Case Review</h2>
          <div className={styles.reviewMeta}>
            <span className={styles.applicantName}>{data.name}</span>
            <span className={styles.statusBadge}>{data.status}</span>
          </div>
        </div>
        <div className={styles.assignedTo}>
          <span className={styles.assignedLabel}>ASSIGNED TO</span>
          <span className={styles.assignedName}>{data.assignedTo}</span>
        </div>
      </div>

      {/* ── Two-column layout: left content | right action panel ── */}
      <div className={styles.reviewColumns}>

        {/* ── LEFT: Discrepancy alert + Comparison table ── */}
        <div className={styles.reviewLeft}>

          {/* Critical Discrepancies Alert */}
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}><IconAlert /></div>
            <div className={styles.alertContent}>
              <h4 className={styles.alertTitle}>Critical Discrepancies Found</h4>
              <p className={styles.alertText}>
                The system flagged {data.discrepancies.length} inconsistenc{data.discrepancies.length === 1 ? 'y' : 'ies'} that exceed the automated threshold for approval. Human verification is mandatory.
              </p>
              <div className={styles.alertTags}>
                {data.discrepancies.map((d, i) => (
                  <span key={i} className={styles.alertTag}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className={styles.comparisonCard}>
            <div className={styles.comparisonHeader}>
              <span className={styles.comparisonTitle}>SIDE-BY-SIDE COMPARISON</span>
              <span className={styles.comparisonBadge}>AUTO-ALIGNED MAPPING</span>
            </div>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>FIELD ATTRIBUTE</th>
                  <th>SUBMITTED DATA</th>
                  <th>SYSTEM / DATABASE RECORDS</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison.map((row, i) => (
                  <tr key={i} className={row.mismatch ? styles.mismatchRow : ''}>
                    <td className={styles.fieldCell}>{row.field}</td>
                    <td className={row.mismatch ? styles.mismatchValue : styles.matchValue}>{row.submitted}</td>
                    <td className={styles.systemValue}>{row.system}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── RIGHT: Verification Action panel ── */}
        <div className={styles.actionPanel}>
          <h3 className={styles.actionTitle}>Verification Action</h3>

          {/* Internal Notes */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>INTERNAL NOTES</label>
            <textarea
              className={styles.notesArea}
              placeholder="Mention specific observations about the discrepancy…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
            />
          </div>

          {/* Rejection Reason */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>REJECTION REASON (IF APPLICABLE)</label>
            <select
              className={styles.reasonSelect}
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              {rejectionReasons.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Action Buttons */}
          <button className={styles.btnApprove} onClick={() => setDecision('approved')}>
            <IconCheck /> Approve Verification
          </button>
          <button className={styles.btnReject} onClick={() => setDecision('rejected')}>
            <IconX /> Reject Case
          </button>

          {/* Escalation Policy */}
          <div className={styles.escalationNote}>
            <span className={styles.escalationLabel}>ESCALATION POLICY</span>
            <p>Decisions are final and logged in the permanent audit trail with your digital signature ID #{data.caseId}-SECURE.</p>
          </div>

          {/* Review Context */}
          <div className={styles.reviewContext}>
            <span className={styles.contextTitle}>REVIEW CONTEXT</span>
            <div className={styles.contextRow}>
              <span>Queue Time</span><strong>{data.queueTime}</strong>
            </div>
            <div className={styles.contextRow}>
              <span>Priority</span>
              <strong style={{ color: data.priority === 'High' ? 'var(--error)' : data.priority === 'Medium' ? '#e65100' : '#34A853' }}>
                {data.priority === 'High' ? '! ' : ''}{data.priority}
              </strong>
            </div>
            <div className={styles.contextRow}>
              <span>Voter Category</span><strong>{data.category}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Cases = () => {
  const { searchQuery } = useOutletContext();

  const [activeTab, setActiveTab] = useState("All");
  const [casesData, setCasesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingCase, setReviewingCase] = useState(null);

  const [summary, setSummary] = useState({
    totalCases: 0,
    pendingCases: 0,
    unauthorisedCases: 0,
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);

        const reviewRes = await getReviewVoters();
        const suspiciousRes =
          await getSuspiciousVoters();

        const reviewVoters =
          reviewRes?.data?.voters ||
          reviewRes?.data ||
          [];

        const suspiciousVoters =
          suspiciousRes?.data?.voters ||
          suspiciousRes?.data ||
          [];

        // Pending Cases
        const reviewCases = reviewVoters.map(
          (voter, index) => ({
            id:
              voter.voterId ||
              voter._id ||
              `CASE-${1000 + index}`,

            name: voter.name || "Unknown User",

            type: "Manual Review Required",

            priority: "Medium",

            date: voter.createdAt
              ? new Date(
                voter.createdAt
              ).toLocaleDateString()
              : "N/A",

            status: "Pending",
          })
        );

        // Unauthorised Cases
        const suspiciousCases =
          suspiciousVoters.map(
            (voter, index) => ({
              id:
                voter.voterId ||
                voter._id ||
                `CASE-${2000 + index}`,

              name:
                voter.name || "Unknown User",

              type:
                "Suspicious Verification",

              priority: "High",

              date: voter.createdAt
                ? new Date(
                  voter.createdAt
                ).toLocaleDateString()
                : "N/A",

              status: "Unauthorised",
            })
          );

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
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  // FILTER LOGIC

  const filteredCases = casesData.filter(
    (c) =>
      (activeTab === "All" ||
        c.status === activeTab) &&
      (c.name
        ?.toLowerCase()
        .includes(
          (searchQuery || "").toLowerCase()
        ) ||
        c.id
          ?.toLowerCase()
          .includes(
            (searchQuery || "").toLowerCase()
          ))
  );

  if (reviewingCase) {
    return (
      <main className={dashboardStyles.mainContent} style={{ padding: '2rem' }}>
        <ManualReviewPanel caseRow={reviewingCase} onBack={() => setReviewingCase(null)} />
      </main>
    );
  }

  return (
    <main
      className={dashboardStyles.mainContent}
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
            Review and manage flagged voter
            applications with ML assisted
            fraud detection.
          </p>
        </div>

        <button
          className={dashboardStyles.exportBtn}
        >
          Export Cases
        </button>
      </div>

      {/* SUMMARY CARDS */}

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

          <h1>{summary.totalCases}</h1>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h4>Pending Review</h4>

          <h1>{summary.pendingCases}</h1>
        </div>

        <div
          className={
            dashboardStyles.metricCard
          }
        >
          <h4>Unauthorised</h4>

          <h1>
            {summary.unauthorisedCases}
          </h1>
        </div>
      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom: "1px solid #ddd",
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
          <h2>Investigation Queue</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            className={
              dashboardStyles.dataTable
            }
          >
            <thead>
              <tr>
                <th>CASE ID</th>
                <th>APPLICANT NAME</th>
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
                    No matching cases found
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
                        <button
                          style={{
                            background:
                              "#0057d9",
                            color: "white",
                            border: "none",
                            padding:
                              "0.5rem 1rem",
                            borderRadius:
                              "20px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                          onClick={() => setReviewingCase(c)}
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