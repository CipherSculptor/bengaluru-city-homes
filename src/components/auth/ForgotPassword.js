import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import Logo from "../../assets/Logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle password reset
    console.log("Password reset requested for:", email);
    // For now, just show success message
    setIsSubmitted(true);
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
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
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

              <button type="submit" className="reset-btn">
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Email Sent</h2>
            <p>
              If an account exists with the email <strong>{email}</strong>, you
              will receive password reset instructions.
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
