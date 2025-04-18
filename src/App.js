import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import ProjectDetails from "./components/projectDetails/ProjectDetails";
import SlotBooking from "./components/slotBooking/SlotBooking";
import Profile from "./components/profile/Profile";
import Location from "./components/location/Location";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SavedPropertiesProvider } from "./context/SavedPropertiesContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <SavedPropertiesProvider>
            <AppContent />
          </SavedPropertiesProvider>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

// Separate component for the app content
const AppContent = () => {
  // Use state to track current path
  const [currentPath, setCurrentPath] = React.useState(
    window.location.pathname
  );

  // Get authentication state using the useAuth hook
  const { currentUser } = useAuth();

  // Update path when it changes
  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for location changes
    window.addEventListener("popstate", handleLocationChange);

    // Also listen for clicks on links that use React Router
    const originalPushState = window.history.pushState;
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Check if current path is an auth page
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(
    currentPath
  );

  return (
    <div className="App">
      {/* Only show navbar when user is authenticated and not on auth pages */}
      {currentUser && !isAuthPage && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slot-booking"
          element={
            <ProtectedRoute>
              <SlotBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
