import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ForgotPassword.css";
import Logo from "../../assets/Logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending password reset email to:", email);
      const result = await resetPassword(email);

      if (result.success) {
        console.log("Password reset email sent successfully");
        setIsSubmitted(true);
      } else {
        setError(result.error || "Failed to send password reset email");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in password reset:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* Background elements */}
      <div className="forgot-password-background">
        <div className="wave-pattern"></div>
      </div>

      {/* Logo */}
      <div className="forgot-password-logo">
        <img src={Logo} alt="Bengaluru City Homes" />
      </div>

      {/* Forgot Password Card */}
      <div className="forgot-password-card">
        {!isSubmitted ? (
          <>
            <div className="forgot-password-header">
              <h2>Bengaluru City Homes</h2>
              <h1>Forgot Password</h1>
              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={loading}
                />
                <div className="input-icon email-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7-10-7" />
                  </svg>
                </div>
              </div>

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Email Sent</h2>
            <p>
              A password reset link has been sent to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <p className="small-note">
              If you don't see the email, please check your spam folder. The
              email will come from Firebase.
            </p>
          </div>
        )}

        <div className="forgot-password-options">
          <Link to="/login" className="back-to-login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
