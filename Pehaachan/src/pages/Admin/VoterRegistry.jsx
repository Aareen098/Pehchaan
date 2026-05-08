import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getVerifiedVoters } from "../../services/api";
import styles from "./VoterRegistry.module.css";

const VoterRegistry = () => {
  const { searchQuery } = useOutletContext();

  const [registrants, setRegistrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRegistered: 0,
    newRegistrations: 0,
    activeVoters: 0,
    flaggedProfiles: 0,
  });

  // =====================================
  // FETCH VERIFIED VOTERS + KPI STATS
  // =====================================

  useEffect(() => {
    const fetchVerifiedVoters = async () => {
      try {
        const res = await getVerifiedVoters();

        const voters = res.data.voters || [];

        const formattedData = voters.map((voter) => ({
          id: voter.voterId || "N/A",

          name: voter.name,

          ref: voter.aadhaar
            ? `XXXX-XXXX-${voter.aadhaar.slice(-4)}`
            : "N/A",

          constituency: voter.city || "N/A",

          date: new Date(
            voter.createdAt
          ).toLocaleDateString(),

          status:
            voter.classification || "Verified",

          initials: voter.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),

          color: "#dbeafe",
          textColor: "var(--primary)",

          statusStyle: {
            bg: "#E6F4EA",
            text: "#34A853",
          },
        }));

        setRegistrants(formattedData);

        // KPI calculations
        setStats({
          totalRegistered: voters.length,
          newRegistrations: voters.length,
          activeVoters: voters.length,
          flaggedProfiles: 0,
        });

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchVerifiedVoters();
  }, []);

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredRegistrants =
    registrants.filter(
      (reg) =>
        reg.name
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        reg.id
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
    );

  return (
    <main className={styles.mainContent}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>
            Voter Registry
          </h2>

          <p className={styles.pageSubtitle}>
            Live Electoral Statistics &
            Regional Management
          </p>
        </div>
      </div>

      {/* =====================================
          KPI SUMMARY GRID
      ===================================== */}

      <div className={styles.kpiGrid}>
        {/* Total Registered */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div
              className={styles.kpiIconWrapper}
              style={{
                backgroundColor:
                  "rgba(0, 91, 191, 0.1)",
                color: "var(--primary)",
              }}
            >
              <span className="material-symbols-outlined">
                groups
              </span>
            </div>

            <span
              className={styles.kpiBadge}
              style={{
                backgroundColor: "#E6F4EA",
                color: "#34A853",
              }}
            >
              Live
            </span>
          </div>

          <h3 className={styles.kpiLabel}>
            Total Registered
          </h3>

          <p className={styles.kpiValue}>
            {stats.totalRegistered}
          </p>
        </div>

        {/* New Registrations */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div
              className={styles.kpiIconWrapper}
              style={{
                backgroundColor: "#E6F4EA",
                color: "#34A853",
              }}
            >
              <span className="material-symbols-outlined">
                person_add
              </span>
            </div>

            <span
              className={styles.kpiBadge}
              style={{
                backgroundColor: "#E6F4EA",
                color: "#34A853",
              }}
            >
              Live
            </span>
          </div>

          <h3 className={styles.kpiLabel}>
            New Registrations
          </h3>

          <p className={styles.kpiValue}>
            {stats.newRegistrations}
          </p>
        </div>

        {/* Active Voters */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div
              className={styles.kpiIconWrapper}
              style={{
                backgroundColor:
                  "rgba(197, 85, 0, 0.1)",
                color: "var(--tertiary)",
              }}
            >
              <span className="material-symbols-outlined">
                verified
              </span>
            </div>

            <span
              className={styles.kpiBadge}
              style={{
                backgroundColor:
                  "var(--surface-container-high)",
                color: "var(--outline)",
              }}
            >
              Stable
            </span>
          </div>

          <h3 className={styles.kpiLabel}>
            Active Voters
          </h3>

          <p className={styles.kpiValue}>
            {stats.activeVoters}
          </p>
        </div>

        {/* Flagged Profiles */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div
              className={styles.kpiIconWrapper}
              style={{
                backgroundColor:
                  "rgba(186, 26, 26, 0.1)",
                color: "var(--error)",
              }}
            >
              <span className="material-symbols-outlined">
                flag
              </span>
            </div>

            <span
              className={styles.kpiBadge}
              style={{
                backgroundColor:
                  "var(--error-container)",
                color: "var(--error)",
              }}
            >
              Live
            </span>
          </div>

          <h3 className={styles.kpiLabel}>
            Flagged Profiles
          </h3>

          <p className={styles.kpiValue}>
            {stats.flaggedProfiles}
          </p>
        </div>
      </div>

      {/* =====================================
          MAP SECTION RESTORED
      ===================================== */}

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <div>
            <h3 className={styles.mapTitle}>
              Regional Registration Density
            </h3>

            <p className={styles.mapSubtitle}>
              Geospatial analysis of voter
              distribution
            </p>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{
              height: "100%",
              width: "100%",
              zIndex: 1,
            }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <Circle
              center={[28.6139, 77.209]}
              radius={50000}
            >
              <Popup>
                Delhi: High Verified Density
              </Popup>
            </Circle>

            <Circle
              center={[19.076, 72.8777]}
              radius={60000}
            >
              <Popup>
                Mumbai: Strong Registry
              </Popup>
            </Circle>

            <Circle
              center={[13.0827, 80.2707]}
              radius={45000}
            >
              <Popup>
                Chennai: Stable Registry
              </Popup>
            </Circle>
          </MapContainer>
        </div>
      </section>

      {/* =====================================
          TABLE SECTION
      ===================================== */}

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>
            Recent Registrants
          </h3>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Voter ID</th>
                <th>Aadhaar Ref</th>
                <th>Constituency</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    Loading verified voters...
                  </td>
                </tr>
              ) : filteredRegistrants.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    No matching voters found
                  </td>
                </tr>
              ) : (
                filteredRegistrants.map(
                  (reg, index) => (
                    <tr key={index}>
                      <td>
                        {reg.name}
                      </td>

                      <td>
                        {reg.id}
                      </td>

                      <td>
                        {reg.ref}
                      </td>

                      <td>
                        {
                          reg.constituency
                        }
                      </td>

                      <td>
                        {reg.date}
                      </td>

                      <td>
                        {reg.status}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default VoterRegistry;