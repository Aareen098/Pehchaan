import React, { useState } from "react";
import dashboardStyles from "./AdminDashboard.module.css";
import s from "./Settings.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] =
    useState("Profile");

  // =====================================
  // SETTINGS STATE
  // PREMIUM UI + EXISTING FUNCTIONALITY
  // =====================================

  const [settingsData, setSettingsData] =
    useState({
      fullName: "Admin User",
      designation:
        "System Administrator",
      email:
        "admin@pehchaan.gov.in",
      department:
        "Election Commission Department",

      verificationThreshold: 94,
      twoFaEnabled: true,

      notifications: {
        criticalAnomalies: true,
        manualEscalations: true,
        dailyDigest: false,
      },

      dataRetention:
        "Permanent Storage",

      systemMode:
        "AI Assisted Verification",
      auditLogs: true,
      autoEscalation: true,
    });

  // =====================================
  // INPUT HANDLERS
  // =====================================

  const handleThresholdChange = (e) => {
    setSettingsData({
      ...settingsData,
      verificationThreshold:
        e.target.value,
    });
  };

  const handle2FAChange = (e) => {
    setSettingsData({
      ...settingsData,
      twoFaEnabled:
        e.target.checked,
    });
  };

  const handleNotificationChange = (
    field
  ) => {
    setSettingsData({
      ...settingsData,
      notifications: {
        ...settingsData.notifications,
        [field]:
          !settingsData.notifications[
            field
          ],
      },
    });
  };

  const handleRetentionChange = (e) => {
    setSettingsData({
      ...settingsData,
      dataRetention:
        e.target.value,
    });
  };

  const handleSave = () => {
    alert(
      "Settings saved successfully"
    );
  };

  const handleDiscard = () => {
    window.location.reload();
  };

  return (
    <main
      className={
        dashboardStyles.mainContent
      }
      style={{
        padding: "2rem 3rem",
        backgroundColor: "#FAFAFB",
      }}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className={
          dashboardStyles.header
        }
        style={{
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2
            className={
              dashboardStyles.pageTitle
            }
          >
            Settings
          </h2>

          <p
            className={
              dashboardStyles.pageSubtitle
            }
          >
            Manage admin profile,
            security layers and
            ML verification system
            configuration.
          </p>
        </div>

        <button
          className={
            dashboardStyles.exportBtn
          }
        >
          Export Config
        </button>
      </div>

      {/* =====================================
          PREMIUM TABS
      ===================================== */}

      <div
        style={{
          display: "flex",
          gap: "2rem",
          borderBottom:
            "1px solid var(--outline-variant)",
          marginBottom: "1.5rem",
        }}
      >
        {[
          "Profile",
          "Security",
          "System Configuration",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            style={{
              padding:
                "1rem 0",
              background:
                "none",
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
              fontSize:
                "0.95rem",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={s.settingsGrid}>
        {/* =====================================
            LEFT COLUMN
        ===================================== */}

        <div className={s.settingsCol}>
          {/* Profile Card */}
          <div className={s.card}>
            <div
              className={s.cardHeader}
            >
              <h3
                className={s.cardTitle}
              >
                Profile Information
              </h3>
            </div>

            <div className={s.formGrid}>
              <div
                className={
                  s.inputGroup
                }
              >
                <label
                  className={
                    s.inputLabel
                  }
                >
                  Full Name
                </label>

                <input
                  type="text"
                  className={
                    s.textInput
                  }
                  value={
                    settingsData.fullName
                  }
                  readOnly
                />
              </div>

              <div
                className={
                  s.inputGroup
                }
              >
                <label
                  className={
                    s.inputLabel
                  }
                >
                  Designation
                </label>

                <input
                  type="text"
                  className={
                    s.textInput
                  }
                  value={
                    settingsData.designation
                  }
                  readOnly
                />
              </div>

              <div
                className={
                  s.inputGroupFull
                }
              >
                <label
                  className={
                    s.inputLabel
                  }
                >
                  Official Email
                </label>

                <input
                  type="email"
                  className={
                    s.textInput
                  }
                  value={
                    settingsData.email
                  }
                  readOnly
                />
              </div>

              <div
                className={
                  s.inputGroupFull
                }
              >
                <label
                  className={
                    s.inputLabel
                  }
                >
                  Department
                </label>

                <input
                  type="text"
                  className={
                    s.textInput
                  }
                  value={
                    settingsData.department
                  }
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className={s.card}>
            <div
              className={s.cardHeader}
            >
              <h3
                className={s.cardTitle}
              >
                Security Settings
              </h3>
            </div>

            <div
              className={
                s.securityList
              }
            >
              {/* 2FA */}
              <div
                className={
                  s.securityItem
                }
              >
                <div>
                  <h4>
                    Two-Factor
                    Authentication
                  </h4>

                  <p>
                    Enable
                    additional
                    protection for
                    admin login
                  </p>
                </div>

                <label
                  className={
                    s.toggle
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      settingsData.twoFaEnabled
                    }
                    onChange={
                      handle2FAChange
                    }
                  />

                  <span
                    className={
                      s.slider
                    }
                  ></span>
                </label>
              </div>

              {/* Audit Logs */}
              <div
                className={
                  s.securityItem
                }
              >
                <div>
                  <h4>
                    Audit Logs
                  </h4>

                  <p>
                    Maintain full
                    admin action
                    tracking
                  </p>
                </div>

                <label
                  className={
                    s.toggle
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      settingsData.auditLogs
                    }
                    onChange={() =>
                      setSettingsData(
                        {
                          ...settingsData,
                          auditLogs:
                            !settingsData.auditLogs,
                        }
                      )
                    }
                  />

                  <span
                    className={
                      s.slider
                    }
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT COLUMN
        ===================================== */}

        <div className={s.settingsCol}>
          <div className={s.card}>
            <div
              className={s.cardHeader}
            >
              <h3
                className={s.cardTitle}
              >
                System
                Configuration
              </h3>
            </div>

            {/* Verification Threshold */}
            <div
              className={
                s.configSection
              }
            >
              <div
                className={
                  s.configLabel
                }
              >
                <span>
                  Verification
                  Threshold
                </span>

                <span
                  style={{
                    color:
                      "var(--primary)",
                  }}
                >
                  {
                    settingsData.verificationThreshold
                  }
                  %
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="99"
                value={
                  settingsData.verificationThreshold
                }
                onChange={
                  handleThresholdChange
                }
                className={
                  s.sliderInput
                }
              />
            </div>

            {/* Notification Logic */}
            <div
              className={
                s.configSection
              }
            >
              <h4>
                Notification Logic
              </h4>

              <div
                className={
                  s.checkboxList
                }
              >
                {[
                  [
                    "criticalAnomalies",
                    "Critical Data Anomalies",
                  ],
                  [
                    "manualEscalations",
                    "Manual Review Escalations",
                  ],
                  [
                    "dailyDigest",
                    "Daily Performance Digest",
                  ],
                ].map(
                  (
                    item,
                    index
                  ) => (
                    <label
                      key={index}
                      className={
                        s.checkboxItem
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          settingsData
                            .notifications[
                            item[0]
                          ]
                        }
                        onChange={() =>
                          handleNotificationChange(
                            item[0]
                          )
                        }
                      />

                      {item[1]}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Data Retention */}
            <div
              className={
                s.configSection
              }
            >
              <h4>
                Data Retention
              </h4>

              <select
                className={
                  s.selectInput
                }
                value={
                  settingsData.dataRetention
                }
                onChange={
                  handleRetentionChange
                }
              >
                <option>
                  Permanent
                  Storage
                </option>
                <option>
                  3 Years Archive
                </option>
                <option>
                  1 Year Purge
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          FOOTER ACTIONS
      ===================================== */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={
            handleDiscard
          }
          style={{
            background:
              "none",
            border: "none",
            cursor:
              "pointer",
            fontWeight: "700",
          }}
        >
          Discard Changes
        </button>

        <button
          onClick={handleSave}
          style={{
            padding:
              "0.85rem 1.6rem",
            backgroundColor:
              "var(--primary)",
            color: "white",
            border: "none",
            borderRadius:
              "0.75rem",
            fontWeight: "700",
            cursor:
              "pointer",
          }}
        >
          Save All Parameters
        </button>
      </div>
    </main>
  );
};

export default Settings;