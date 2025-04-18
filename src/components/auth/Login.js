import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import Logo from "../../assets/Logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login, isAuthenticated, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the login function from AuthContext
      const result = await login(email, password);

      if (result.success) {
        setLoginSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          // Redirect to the page they were trying to access, or home
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError(result.error || "Failed to log in");
        setLoading(false);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handler for Google sign-in (with popup and redirect fallback)
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    setLoginSuccess(true); // Show loading indicator immediately

    try {
      console.log("Initiating Google sign-in");

      // Sign-in with Google (popup with redirect fallback)
      const result = await signInWithGoogle("auto");

      if (result.success) {
        if (!result.redirect) {
          // Sign-in successful with popup
          console.log("Google sign-in successful, redirecting...");
          setLoginSuccess(true);

          // Redirect after a short delay to show success message
          setTimeout(() => {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
          }, 1000);
        } else {
          // Redirect is happening, hide the loading indicator after a longer timeout
          // since the page will redirect and this UI won't be visible anyway
          setTimeout(() => {
            setLoading(false);
            setLoginSuccess(false);
          }, 15000); // Increased to 15 seconds
        }
      } else {
        // Handle error from Google sign-in
        setError(result.error || "Failed to sign in with Google");
        setLoading(false);
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(
        "Failed to sign in with Google. Please try the direct link below."
      );
      setLoading(false);
      setLoginSuccess(false);
    }
  };

  // Handler for direct link Google sign-in
  const handleDirectLinkSignIn = async () => {
    setError("");
    setLoading(true);
    setLoginSuccess(true);

    try {
      console.log("Using direct link for Google sign-in");

      // Use the redirect method directly from our context
      // This avoids using Firebase functions directly in this component
      const result = await signInWithGoogle("redirect");

      if (result.success) {
        // For redirect, the page will reload, so we just show a message
        console.log("Redirect initiated, page will reload");

        // Keep the loading state for a bit longer
        setTimeout(() => {
          setError(
            "If you're not redirected automatically, please check your popup blocker settings."
          );
          setLoading(false);
          setLoginSuccess(false);
        }, 8000);
      } else {
        // Handle error
        setError(result.error || "Failed to sign in with Google");
        setLoading(false);
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Direct link sign-in error:", error);
      setError("Failed to sign in with direct link. Please try again later.");
      setLoading(false);
      setLoginSuccess(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background elements */}
      <div className="login-background">
        <div className="wave-pattern"></div>
      </div>

      {/* Logo */}
      <div className="login-logo">
        <img src={Logo} alt="Bengaluru City Homes" />
      </div>

      <div className="login-container">
        {/* Left Column - Content */}
        <div className="login-content-column">
          {/* Website Description */}
          <div className="website-description">
            <h2>Find Your Dream Home in Bengaluru</h2>
            <p>
              Bengaluru City Homes offers premium residential properties in the
              most desirable locations across Bengaluru. Our platform makes it
              easy to discover, explore, and book your perfect home.
            </p>
          </div>

          {/* Features Showcase */}
          <div className="features-showcase">
            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Premium Properties</h3>
                <p>
                  Discover exclusive apartments and villas in Bengaluru's most
                  sought-after locations
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Easy Scheduling</h3>
                <p>
                  Book site visits at your convenience with our simple online
                  scheduling system
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 14l2 2 4-4"></path>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Personalized Dashboard</h3>
                <p>
                  Track your bookings and favorite properties in your personal
                  profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="login-form-column">
          {/* Login Card */}
          <div className="login-card">
            {loginSuccess && (
              <div className="login-success-message">
                <div
                  className={`success-icon ${loading ? "loading-spinner" : ""}`}
                >
                  {loading ? "⟳" : "✓"}
                </div>
                <p>
                  {loading
                    ? "Connecting to Google authentication..."
                    : "Login successful! Redirecting..."}
                </p>
              </div>
            )}
            <div className="login-header">
              <h2>Welcome to</h2>
              <h1>Bengaluru City Homes</h1>
              <h3>Login</h3>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}
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

              <div className="form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <div
                  className="input-icon password-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </div>
              </div>

              <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="login-options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
              <div className="or-divider">
                <span>or</span>
              </div>
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>

            <div className="social-login">
              <button
                type="button"
                className="google-btn"
                disabled={loading}
                onClick={handleGoogleSignIn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="22"
                  height="22"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Direct link fallback option */}
              <div className="direct-link-container">
                <button
                  type="button"
                  className="direct-link-btn"
                  disabled={loading}
                  onClick={handleDirectLinkSignIn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  <span>Try Direct Link</span>
                </button>
                <p className="direct-link-info">
                  If the button above doesn't work, try this direct link
                </p>
              </div>
              <button type="button" className="facebook-btn" disabled={loading}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="22"
                  height="22"
                >
                  <linearGradient
                    id="Ld6sqrtcxMyckEl6xeDdMa"
                    x1="9.993"
                    x2="40.615"
                    y1="9.993"
                    y2="40.615"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#2aa4f4" />
                    <stop offset="1" stopColor="#007ad9" />
                  </linearGradient>
                  <path
                    fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
                    d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                  />
                  <path
                    fill="#fff"
                    d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                  />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
