import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // HANDLE LOGIN
  // =====================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(formData);

      console.log("Login Response:", res.data);

      // Save token + role
      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      alert("Login successful");

      // Redirect by role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.blurBlobPrimary}></div>
      <div className={styles.blurBlobSecondary}></div>

      <div className={styles.contentWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  "'FILL' 1",
              }}
            >
              fingerprint
            </span>
          </div>

          <h1 className={styles.title}>
            Pehchaan
          </h1>

          <p className={styles.subtitle}>
            Democratic Identity Portal
          </p>
        </header>

        {/* Card */}
        <main className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              Welcome back
            </h2>

            <p
              className={
                styles.cardDescription
              }
            >
              Please enter your credentials
              to access your secure profile.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label
                className={styles.label}
                htmlFor="email"
              >
                Email Address
              </label>

              <div
                className={
                  styles.inputWrapper
                }
              >
                <div
                  className={
                    styles.inputIcon
                  }
                >
                  <span className="material-symbols-outlined">
                    mail
                  </span>
                </div>

                <input
                  className={styles.input}
                  id="email"
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
              <div
                className={
                  styles.labelFlex
                }
              >
                <label
                  className={styles.label}
                  htmlFor="password"
                >
                  Password
                </label>

                <a
                  className={
                    styles.forgotPassword
                  }
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              <div
                className={
                  styles.inputWrapper
                }
              >
                <div
                  className={
                    styles.inputIcon
                  }
                >
                  <span className="material-symbols-outlined">
                    lock
                  </span>
                </div>

                <input
                  className={styles.input}
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className={
                    styles.visibilityToggle
                  }
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  <span className="material-symbols-outlined">
                    {showPassword
                      ? "visibility_off"
                      : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className={styles.rememberMe}>
              <input
                className={styles.checkbox}
                id="remember"
                type="checkbox"
              />

              <label
                className={
                  styles.rememberLabel
                }
                htmlFor="remember"
              >
                Stay signed in for 30 days
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
                  ? "Logging in..."
                  : "Log in to Pehchaan"}
              </span>

              <span
                className={`material-symbols-outlined ${styles.submitIcon}`}
              >
                arrow_forward
              </span>
            </button>
          </form>

          {/* Register */}
          <div
            className={
              styles.registerPrompt
            }
          >
            <p
              className={
                styles.registerText
              }
            >
              New to the portal?

              <Link
                className={
                  styles.registerLink
                }
                to="/register"
              >
                Register your account
              </Link>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <a
            className={styles.footerLink}
            href="#"
          >
            Privacy Policy
          </a>

          <a
            className={styles.footerLink}
            href="#"
          >
            Terms of Service
          </a>

          <a
            className={styles.footerLink}
            href="#"
          >
            Contact Support
          </a>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;