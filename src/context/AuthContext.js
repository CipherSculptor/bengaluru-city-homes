import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
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

  // Google sign-in function - direct popup method (fastest)
  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in with popup");

      // Create provider
      const provider = new GoogleAuthProvider();

      // Minimal configuration for speed
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Direct popup method - fastest approach
      const result = await signInWithPopup(auth, provider);

      // If we get here, sign-in was successful
      console.log("Google sign-in successful");
      return {
        success: true,
        user: result.user,
        credential: GoogleAuthProvider.credentialFromResult(result),
      };
    } catch (error) {
      console.error("Google sign-in error:", error);

      // Handle specific error codes
      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please enable popups for this site.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Another sign-in attempt is in progress.";
      }

      return { success: false, error: errorMessage };
    }
  };

  // No redirect handler needed with direct popup method

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
