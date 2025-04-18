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

  // Google sign-in function
  const signInWithGoogle = async () => {
    try {
      // Store a flag in localStorage to track Google sign-in attempts
      localStorage.setItem("googleSignInAttempt", "true");
      localStorage.setItem("googleSignInStartTime", Date.now().toString());

      const provider = new GoogleAuthProvider();

      // Add scopes for better user experience
      provider.addScope("profile");
      provider.addScope("email");

      // Set custom parameters
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Try popup first (faster) with fallback to redirect
      try {
        console.log("Attempting Google sign-in with popup...");
        const result = await signInWithPopup(auth, provider);
        // Clear the localStorage flags on success
        localStorage.removeItem("googleSignInAttempt");
        localStorage.removeItem("googleSignInStartTime");
        return { success: true, user: result.user };
      } catch (popupError) {
        console.warn(
          "Popup sign-in failed, falling back to redirect:",
          popupError
        );
        // If popup fails (common on mobile), fall back to redirect
        await signInWithRedirect(auth, provider);
        return { success: true, redirect: true };
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Clear the localStorage flags on error
      localStorage.removeItem("googleSignInAttempt");
      localStorage.removeItem("googleSignInStartTime");

      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups or try again.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Multiple popup requests were made. Please try again.";
      }

      return { success: false, error: errorMessage };
    }
  };

  // Handle redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      // Check if we have a pending Google sign-in
      const hasGoogleSignInAttempt =
        localStorage.getItem("googleSignInAttempt") === "true";
      const startTime = localStorage.getItem("googleSignInStartTime");

      // Only proceed if we have a pending sign-in attempt
      if (hasGoogleSignInAttempt) {
        try {
          console.log("Checking for redirect result...");

          // Calculate how long the sign-in has been pending
          if (startTime) {
            const elapsedTime = Date.now() - parseInt(startTime);
            console.log(`Google sign-in has been pending for ${elapsedTime}ms`);
          }

          const result = await getRedirectResult(auth);
          if (result && result.user) {
            // User successfully signed in with redirect
            console.log("Redirect sign-in successful");
            setCurrentUser(result.user);

            // Clear the localStorage flags on success
            localStorage.removeItem("googleSignInAttempt");
            localStorage.removeItem("googleSignInStartTime");

            // You could add additional user data handling here
            // For example, storing user preferences or redirecting to a specific page
          } else {
            console.log("No redirect result found");

            // If it's been more than 2 minutes, assume the sign-in failed
            if (startTime && Date.now() - parseInt(startTime) > 120000) {
              console.warn("Google sign-in timed out after 2 minutes");
              localStorage.removeItem("googleSignInAttempt");
              localStorage.removeItem("googleSignInStartTime");
            }
          }
        } catch (error) {
          console.error("Error with redirect sign-in:", error);
          // Clear the localStorage flags on error
          localStorage.removeItem("googleSignInAttempt");
          localStorage.removeItem("googleSignInStartTime");
        }
      }
    };

    // Run immediately and then set up an interval to check periodically
    handleRedirectResult();

    const intervalId = setInterval(handleRedirectResult, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

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
