import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVoter } from "../../services/api";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    aadhaar: "",
    voterId: "",
    address: "",
    state: "",
    city: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createVoter(formData);

      alert(res.data.message);

      console.log("Voter Created:", res.data);

      // optional reset form
      setFormData({
        name: "",
        dob: "",
        aadhaar: "",
        voterId: "",
        address: "",
        state: "",
        city: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong while submitting voter data"
      );
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Navbar */}
      <nav className={styles.topbar}>
        <div className={styles.brandArea}>
          <span className={styles.brandText}>Pehchaan</span>
        </div>

        <div className={styles.navActions}>
          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              className={styles.iconBtn}
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >
              <span className="material-symbols-outlined">
                notifications
              </span>
            </button>

            {showNotifications && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  Notifications
                </div>

                <div className={styles.dropdownList}>
                  <button className={styles.dropdownItem}>
                    <div className={styles.dropdownItemContent}>
                      <span className={styles.dropdownItemTitle}>
                        Profile Incomplete
                      </span>
                      <span className={styles.dropdownItemText}>
                        Please upload your Aadhaar for KYC
                        processing.
                      </span>
                      <span className={styles.dropdownItemTime}>
                        Just now
                      </span>
                    </div>
                  </button>
                </div>

                <div className={styles.dropdownFooter}>
                  <button
                    className={styles.dropdownFooterBtn}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            className={styles.iconBtn}
            onClick={handleLogout}
            title="Logout"
          >
            <span className="material-symbols-outlined">
              logout
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Verification Center
          </h1>

          <p className={styles.subtitle}>
            Complete your identity profile to access
            secure voting and civic services.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className={styles.formGrid}
        >
          <div className={styles.mainColumn}>
            {/* Section 1 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">
                  person
                </span>
                Personal Information
              </h2>

              <div className={styles.twoColGrid}>
                {/* Full Name */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="full_name"
                  >
                    Full Name
                  </label>

                  <input
                    className={styles.input}
                    id="full_name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="As per official records"
                  />
                </div>

                {/* DOB */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="dob"
                  >
                    Date of Birth
                  </label>

                  <input
                    className={styles.input}
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    type="date"
                  />
                </div>

                {/* Address */}
                <div
                  className={`${styles.formGroup} ${styles.fullWidth}`}
                >
                  <label
                    className={styles.label}
                    htmlFor="address"
                  >
                    Current Residential Address
                  </label>

                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street, City, State"
                  />
                </div>

                {/* State */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="state"
                  >
                    State
                  </label>

                  <input
                    className={styles.input}
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Punjab"
                  />
                </div>

                {/* City */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="city"
                  >
                    City
                  </label>

                  <input
                    className={styles.input}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Amritsar"
                  />
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">
                  fingerprint
                </span>
                Government Identifiers
              </h2>

              <div className={styles.twoColGrid}>
                {/* Aadhaar */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="aadhaar"
                  >
                    Aadhaar Number
                  </label>

                  <input
                    className={styles.input}
                    id="aadhaar"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>

                {/* Voter ID */}
                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    htmlFor="voter_id"
                  >
                    Voter ID
                  </label>

                  <input
                    className={styles.input}
                    id="voter_id"
                    name="voterId"
                    value={formData.voterId}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="ABC1234567"
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div
              className={`${styles.actionArea} ${styles.fullWidth}`}
            >
              <button
                type="submit"
                className={styles.btnSubmit}
              >
                Submit Verification
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserDashboard;