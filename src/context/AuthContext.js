import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
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
      console.log("Starting Google sign-in process...");
      const provider = new GoogleAuthProvider();

      // Simplify the provider configuration
      provider.addScope("email");

      // Use a simpler configuration
      provider.setCustomParameters({
        prompt: "select_account",
      });

      console.log("Initiating redirect to Google...");
      // Use redirect instead of popup for better compatibility
      await signInWithRedirect(auth, provider);
      console.log("Redirect initiated"); // This may not be logged due to redirect
      return { success: true };
    } catch (error) {
      console.error("Google sign-in error:", error);
      let errorMessage =
        "Failed to sign in with Google: " + (error.message || error);
      return { success: false, error: errorMessage };
    }
  };

  // Handle redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("Checking for redirect result...");
        // Add a flag to localStorage to track if we're in the middle of auth
        const isAuthInProgress = localStorage.getItem("authInProgress");
        console.log("Auth in progress?", isAuthInProgress);

        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result ? "Received" : "None");

        if (result && result.user) {
          // User successfully signed in with redirect
          console.log("Redirect sign-in successful", result.user.email);
          setCurrentUser(result.user);
          localStorage.removeItem("authInProgress"); // Clear the flag

          // Show success alert
          alert("Google sign-in successful!");

          // Redirect to home page
          window.location.href = "/";
        } else {
          console.log("No redirect result found");
          if (isAuthInProgress) {
            console.log("Auth was in progress but no result found");
            localStorage.removeItem("authInProgress"); // Clear the flag
          }
        }
      } catch (error) {
        console.error("Error with redirect sign-in:", error);
        localStorage.removeItem("authInProgress"); // Clear the flag on error
        alert("Error with Google sign-in: " + error.message);
      }
    };

    // Execute immediately
    handleRedirectResult();

    // Also set up a listener for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      if (user) {
        setCurrentUser(user);
        localStorage.removeItem("authInProgress"); // Clear the flag
      }
    });

    return () => {
      unsubscribeAuth(); // Clean up the auth state listener
    };
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
