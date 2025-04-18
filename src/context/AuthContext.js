import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Google sign-in function with improved error handling and debugging
  const signInWithGoogle = async (method = "auto") => {
    try {
      // Set authentication tracking flags in localStorage
      localStorage.setItem("googleAuthAttempt", "true");
      localStorage.setItem("googleAuthStartTime", Date.now().toString());
      localStorage.setItem("googleAuthMethod", method);

      console.log(`Starting Google sign-in (method: ${method})`);

      // Create provider with simplified configuration
      const provider = new GoogleAuthProvider();

      // Simplified configuration for better compatibility
      if (method === "auto" || method === "popup") {
        try {
          // Try popup first if auto or popup method is requested
          console.log("Attempting popup sign-in...");
          const result = await signInWithPopup(auth, provider);

          // Clear auth tracking flags on success
          localStorage.removeItem("googleAuthAttempt");
          localStorage.removeItem("googleAuthStartTime");
          localStorage.removeItem("googleAuthMethod");

          // If we get here, sign-in was successful
          console.log("Google popup sign-in successful");
          return {
            success: true,
            user: result.user,
            method: "popup",
          };
        } catch (popupError) {
          // If popup fails and we're in auto mode, fall back to redirect
          console.log("Popup failed:", popupError);

          if (
            method === "auto" &&
            (popupError.code === "auth/popup-blocked" ||
              popupError.code === "auth/popup-closed-by-user" ||
              popupError.code === "auth/cancelled-popup-request" ||
              popupError.code === "auth/network-request-failed")
          ) {
            console.log("Using redirect fallback...");
            localStorage.setItem("googleAuthMethod", "redirect");
            await signInWithRedirect(auth, provider);
            return { success: true, redirect: true, method: "redirect" };
          } else {
            // Re-throw if it's not a popup-related error or we're not in auto mode
            throw popupError;
          }
        }
      } else if (method === "redirect") {
        // Direct redirect method
        console.log("Using redirect method directly...");
        await signInWithRedirect(auth, provider);
        return { success: true, redirect: true, method: "redirect" };
      } else if (method === "direct-link") {
        // Direct link method - just return the auth object for direct handling
        console.log("Preparing direct link authentication...");
        return {
          success: true,
          directLink: true,
          method: "direct-link",
          provider: provider,
          auth: auth,
        };
      }
    } catch (error) {
      console.error("Google sign-in error:", error);

      // Clear auth tracking flags on error
      localStorage.removeItem("googleAuthAttempt");
      localStorage.removeItem("googleAuthStartTime");
      localStorage.removeItem("googleAuthMethod");

      // Handle specific error codes with improved messages
      let errorMessage = "Failed to sign in with Google";
      if (error.code) {
        console.log("Error code:", error.code);
        if (error.code === "auth/popup-blocked") {
          errorMessage = "Popup was blocked. Please try the direct link below.";
        } else if (error.code === "auth/popup-closed-by-user") {
          errorMessage =
            "Sign-in was cancelled. Please try again or use the direct link.";
        } else if (error.code === "auth/cancelled-popup-request") {
          errorMessage =
            "Another sign-in attempt is in progress. Please wait or try the direct link.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.code === "auth/timeout") {
          errorMessage =
            "Authentication timed out. Please try again or use the direct link.";
        }
      }

      return { success: false, error: errorMessage, method: method };
    }
  };

  // Enhanced redirect result handler with better debugging and error handling
  useEffect(() => {
    const handleRedirectResult = async () => {
      // Check if we have a pending Google auth attempt
      const hasAuthAttempt =
        localStorage.getItem("googleAuthAttempt") === "true";
      const authStartTime = localStorage.getItem("googleAuthStartTime");
      const authMethod = localStorage.getItem("googleAuthMethod");

      if (hasAuthAttempt) {
        try {
          console.log("Checking for redirect result...");

          // Calculate elapsed time for debugging
          if (authStartTime) {
            const elapsedTime = Date.now() - parseInt(authStartTime);
            console.log(
              `Auth attempt has been pending for ${elapsedTime}ms (method: ${
                authMethod || "unknown"
              })`
            );
          }

          const result = await getRedirectResult(auth);

          if (result && result.user) {
            // User successfully signed in with redirect
            console.log("Redirect sign-in successful", result.user);
            setCurrentUser(result.user);

            // Clear auth tracking flags on success
            localStorage.removeItem("googleAuthAttempt");
            localStorage.removeItem("googleAuthStartTime");
            localStorage.removeItem("googleAuthMethod");

            // Store success flag for UI feedback
            localStorage.setItem("googleAuthSuccess", "true");
            localStorage.setItem(
              "googleAuthSuccessTime",
              Date.now().toString()
            );

            // You could add additional user data handling here
            // For example, storing user preferences or redirecting to a specific page
          } else {
            console.log("No redirect result found");

            // Check if the attempt has timed out (15 seconds)
            if (authStartTime && Date.now() - parseInt(authStartTime) > 15000) {
              console.warn("Auth attempt timed out after 15 seconds");
              localStorage.removeItem("googleAuthAttempt");
              localStorage.removeItem("googleAuthStartTime");
              localStorage.removeItem("googleAuthMethod");
            }
          }
        } catch (error) {
          console.error("Error with redirect sign-in:", error);

          // Clear auth tracking flags on error
          localStorage.removeItem("googleAuthAttempt");
          localStorage.removeItem("googleAuthStartTime");
          localStorage.removeItem("googleAuthMethod");
        }
      } else {
        // Check for success flag from previous redirect
        const authSuccess =
          localStorage.getItem("googleAuthSuccess") === "true";
        const authSuccessTime = localStorage.getItem("googleAuthSuccessTime");

        if (authSuccess && authSuccessTime) {
          const elapsedTime = Date.now() - parseInt(authSuccessTime);

          // Only process recent successes (within last 5 seconds)
          if (elapsedTime < 5000) {
            console.log("Processing recent auth success");

            // Clear success flags
            localStorage.removeItem("googleAuthSuccess");
            localStorage.removeItem("googleAuthSuccessTime");

            // Check if we need to redirect the user
            if (!currentUser) {
              // Try to get the result one more time
              try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                  setCurrentUser(result.user);
                }
              } catch (e) {
                console.error(
                  "Error getting redirect result after success:",
                  e
                );
              }
            }
          } else {
            // Clear stale success flags
            localStorage.removeItem("googleAuthSuccess");
            localStorage.removeItem("googleAuthSuccessTime");
          }
        }
      }
    };

    // Run once when the component mounts
    handleRedirectResult();

    // Also set up an interval to check periodically (helpful for redirect flows)
    const intervalId = setInterval(handleRedirectResult, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, [currentUser]);

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "Failed to log in";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed login attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Refresh the user to get updated profile
      setCurrentUser({
        ...userCredential.user,
        displayName: name,
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "Failed to create account";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
