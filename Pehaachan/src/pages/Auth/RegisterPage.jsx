import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    state: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =====================================
  // HANDLE REGISTER
  // =====================================

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await registerUser(formData);

      alert(
        res.data.message ||
          "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <span
            className={`material-symbols-outlined ${styles.logoIcon}`}
          >
            fingerprint
          </span>

          <span className={styles.logoText}>
            Pehchaan
          </span>
        </div>
      </header>

      {/* Main */}
      <main className={styles.mainContent}>
        <div className={styles.registerWrapper}>
          <div className={styles.card}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>
                Create your account
              </h1>

              <p className={styles.cardSubtitle}>
                Join the secure voter
                verification platform
              </p>
            </div>

            {/* Form */}
            <form
              className={styles.form}
              onSubmit={handleRegister}
            >
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Full Name
                </label>

                <div
                  className={styles.inputWrapper}
                >
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    person
                  </span>

                  <input
                    className={styles.input}
                    name="name"
                    type="text"
                    placeholder="Enter your legal name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email Address
                </label>

                <div
                  className={styles.inputWrapper}
                >
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    mail
                  </span>

                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Password
                </label>

                <div
                  className={styles.inputWrapper}
                >
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    lock
                  </span>

                  <input
                    className={styles.input}
                    name="password"
                    type="password"
                    placeholder="Create secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p className={styles.hintText}>
                  Use at least 8 characters
                  for better security
                </p>
              </div>

              {/* State */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  State
                </label>

                <div
                  className={styles.inputWrapper}
                >
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    location_on
                  </span>

                  <input
                    className={styles.input}
                    name="state"
                    type="text"
                    placeholder="Punjab"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  City
                </label>

                <div
                  className={styles.inputWrapper}
                >
                  <span
                    className={`material-symbols-outlined ${styles.inputIcon}`}
                  >
                    apartment
                  </span>

                  <input
                    className={styles.input}
                    name="city"
                    type="text"
                    placeholder="Amritsar"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className={styles.termsWrapper}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  required
                />

                <label
                  className={styles.termsLabel}
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className={styles.link}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className={styles.link}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Registering..."
                    : "Register Account"}
                </span>

                <span
                  className={`material-symbols-outlined ${styles.submitIcon}`}
                >
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Login Prompt */}
            <div className={styles.loginPrompt}>
              <div className={styles.divider}></div>

              <p className={styles.loginText}>
                Already have an account?
                <Link
                  className={styles.loginLink}
                  to="/login"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div
              className={styles.securityBadge}
            >
              <span
                className={`material-symbols-outlined ${styles.badgeIcon}`}
              >
                verified_user
              </span>

              <span className={styles.badgeText}>
                Secure Registration
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div
            className={styles.footerBrand}
          >
            <div
              className={styles.brandRule}
            ></div>

            <p className={styles.brandText}>
              Democratic Identity Portal
            </p>
          </div>

          <div
            className={styles.footerLinks}
          >
            <a
              href="#"
              className={styles.footerLink}
            >
              Privacy
            </a>

            <a
              href="#"
              className={styles.footerLink}
            >
              Terms
            </a>

            <a
              href="#"
              className={styles.footerLink}
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;