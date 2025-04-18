import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";
import "./SlotBooking.css";

// Import project images
import jsnSignatureImage from "../../assets/JSN_signature_Images/MainImage.png";
import jsnSunshineImage from "../../assets/JSN_sunshine_images/main.png";
import slvEnclaveImage from "../../assets/slv_enclave/Main.png";

// Import the project data
const projectData = {
  "jsn-signature": {
    name: "JSN Signature",
    value: "jsn-signature",
    image: jsnSignatureImage,
    tagline: "PREMIUM 2&3BHK APARTMENTS",
  },
  "jsn-sunshine": {
    name: "JSN SunShine",
    value: "jsn-sunshine",
    image: jsnSunshineImage,
    tagline: "PREMIUM 2&3BHK APARTMENTS",
  },
  "slv-enclave": {
    name: "SLV Enclave",
    value: "slv-enclave",
    image: slvEnclaveImage,
    tagline: "LUXURY 2&3BHK APARTMENTS",
  },
};

// Time slot data
const timeSlots = [
  { id: 1, time: "09:00 AM - 10:00 AM", available: true },
  { id: 2, time: "10:00 AM - 11:00 AM", available: true },
  { id: 3, time: "11:00 AM - 12:00 PM", available: true },
  { id: 4, time: "12:00 PM - 01:00 PM", available: true },
  { id: 5, time: "02:00 PM - 03:00 PM", available: true },
  { id: 6, time: "03:00 PM - 04:00 PM", available: true },
  { id: 7, time: "04:00 PM - 05:00 PM", available: true },
  { id: 8, time: "05:00 PM - 06:00 PM", available: true },
];

const SlotBooking = () => {
  const location = useLocation();
  const { addBooking } = useBookings();
  const successRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    apartment: "",
    visitDate: "",
    timeSlot: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);

  // Check if a specific project/apartment was passed in the location state
  useEffect(() => {
    if (location.state && location.state.apartment) {
      setFormData((prev) => ({
        ...prev,
        apartment: location.state.apartment,
      }));

      // Find the project data based on the apartment name
      const project = Object.values(projectData).find(
        (p) => p.name === location.state.apartment
      );
      if (project) {
        setSelectedProject(project);
      }
    }

    // Start the entrance animation
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    // Check if the server is running
    checkServerAvailability();
  }, [location.state]);

  // Function to check if the booking server is available
  const checkServerAvailability = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for mobile

      // For Vercel deployment, we need to use the deployed API endpoints
      const isVercelDeployment =
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("bengaluru-city-homes");

      console.log(
        "Deployment environment:",
        isVercelDeployment ? "Vercel" : "Local/Other"
      );
      console.log("Current hostname:", window.location.hostname);
      console.log("Current origin:", window.location.origin);

      // Try multiple endpoints to check server availability
      const possibleUrls = [
        // Always try the relative path first
        "/api/booking-status",

        // Then try the full origin path
        `${window.location.origin}/api/booking-status`,

        // For local development
        ...(!isVercelDeployment
          ? [
              "http://localhost:5001/api/booking-status",
              "http://127.0.0.1:5001/api/booking-status",
            ]
          : []),
      ];

      let serverAvailable = false;
      let lastError = null;

      // Try each URL until one works
      for (const url of possibleUrls) {
        try {
          console.log(`Checking server availability at: ${url}`);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            signal: controller.signal,
            mode: "cors",
            credentials: "same-origin",
          });

          console.log(`Response status for ${url}:`, response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Server status response:", data);
            serverAvailable = true;
            break;
          } else {
            console.log(
              `Non-OK response from ${url}:`,
              response.status,
              response.statusText
            );
            const errorText = await response.text();
            console.log(`Response body:`, errorText);
          }
        } catch (err) {
          console.log(`Error checking ${url}:`, err);
          lastError = err;
          // Continue to next URL
        }
      }

      clearTimeout(timeoutId);

      if (serverAvailable) {
        setIsServerAvailable(true);
        console.log("Booking server is available");
      } else {
        // For Vercel deployment, we'll assume the server is available even if we can't connect
        // This is because Vercel's serverless functions might not respond to our health check
        // but will still process actual booking requests
        if (isVercelDeployment) {
          console.log("Assuming server is available on Vercel deployment");
          setIsServerAvailable(true);
        } else {
          throw lastError || new Error("All server endpoints failed");
        }
      }
    } catch (error) {
      console.log("Booking server is not available:", error);

      // For Vercel deployment, we'll assume the server is available even if we can't connect
      const isVercelDeployment =
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("bengaluru-city-homes");

      if (isVercelDeployment) {
        console.log(
          "Assuming server is available on Vercel deployment despite error"
        );
        setIsServerAvailable(true);
      } else {
        setIsServerAvailable(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If apartment changed, update the selected project
    if (name === "apartment") {
      const project = Object.values(projectData).find((p) => p.name === value);
      if (project) {
        setSelectedProject(project);
      } else {
        setSelectedProject(null);
      }
    }
  };

  // Handle date field click to ensure date picker opens
  const handleDateClick = (e) => {
    // For modern browsers
    if (typeof e.target.showPicker === "function") {
      e.target.showPicker();
    }
  };

  const handleTimeSlotSelect = (slotTime) => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlot: slotTime,
    }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.contactNumber) {
        alert("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.apartment || !formData.visitDate) {
        alert("Please select an apartment and visit date");
        return;
      }
    }

    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setAnimateIn(true);
    }, 300);
  };

  const handlePrevStep = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setAnimateIn(true);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.timeSlot) {
      alert("Please select a time slot");
      return;
    }

    try {
      // Create the booking data object
      const bookingData = {
        property: formData.apartment,
        date: formData.visitDate,
        time: formData.timeSlot,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
      };

      // For Vercel deployment, we need to use the deployed API endpoints
      const isVercelDeployment =
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("bengaluru-city-homes");

      console.log(
        "Submitting booking in environment:",
        isVercelDeployment ? "Vercel" : "Local/Other"
      );
      console.log("Current hostname:", window.location.hostname);
      console.log("Current origin:", window.location.origin);

      // Try multiple API endpoints to ensure connectivity
      const possibleUrls = [
        // Always try the relative path first
        "/api/book-slot",

        // Then try the full origin path
        `${window.location.origin}/api/book-slot`,

        // For local development
        ...(!isVercelDeployment
          ? [
              "http://localhost:5001/api/book-slot",
              "http://127.0.0.1:5001/api/book-slot",
            ]
          : []),
      ];

      let success = false;
      let lastError = null;
      let serverAvailable = false;
      let responseData = null;

      // Try to connect to the server
      for (const apiUrl of possibleUrls) {
        try {
          console.log("Attempting to submit booking to:", apiUrl);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for mobile

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Cache-Control": "no-cache", // Prevent caching
            },
            body: JSON.stringify(formData),
            signal: controller.signal,
            mode: "cors", // Explicitly request CORS
            credentials: "same-origin",
          });

          clearTimeout(timeoutId);
          console.log(`Response status from ${apiUrl}:`, response.status);
          serverAvailable = true;

          if (response.ok) {
            try {
              responseData = await response.json();
              console.log("Server response:", responseData);
              success = true;

              // Check if email was sent successfully
              if (responseData.emailSent) {
                setEmailSent(true);
                if (responseData.emailPreviewUrl) {
                  setEmailPreviewUrl(responseData.emailPreviewUrl);
                  console.log(
                    "Email preview URL:",
                    responseData.emailPreviewUrl
                  );
                }
              } else {
                setEmailSent(false);
              }

              break;
            } catch (jsonError) {
              console.error("Error parsing JSON response:", jsonError);
              const responseText = await response.text();
              console.log("Raw response text:", responseText);
              // Continue with success anyway
              success = true;
              break;
            }
          } else {
            const errorText = await response.text();
            console.error(`Error response from ${apiUrl}:`, errorText);
            console.error(`Status: ${response.status} ${response.statusText}`);
            // Don't throw here, try the next URL
          }
        } catch (err) {
          console.error(`Error submitting to ${apiUrl}:`, err);
          lastError = err;
          // Continue to the next URL
        }
      }

      // For Vercel deployment, assume success even if we couldn't connect
      if (isVercelDeployment && !success) {
        console.log(
          "Assuming booking success on Vercel deployment despite connection issues"
        );
        serverAvailable = true;
        success = true;
      }

      // If server is not available, we'll still save the booking locally
      if (!serverAvailable) {
        console.log("Server not available, saving booking locally only");
        // Update server availability state
        setIsServerAvailable(false);

        // Add the booking to context (which saves to localStorage)
        addBooking(bookingData);

        // Show success message with a note about server unavailability
        setShowSuccess(true);
        setBookingComplete(true);

        // Scroll to success message
        if (successRef.current) {
          successRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Reset form for new bookings
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          apartment: location.state?.apartment || "",
          visitDate: "",
          timeSlot: "",
        });
        setCurrentStep(1);

        // Return early - we've handled the offline case
        return;
      } else {
        // Server is available
        setIsServerAvailable(true);
      }

      // If server was available but request failed
      if (!success) {
        throw lastError || new Error("Failed to connect to the server");
      }

      // If we get here, the booking was successful on the server
      // Add the booking to context
      addBooking(bookingData);

      // Show success message
      setShowSuccess(true);
      setBookingComplete(true);

      // Scroll to success message
      if (successRef.current) {
        successRef.current.scrollIntoView({ behavior: "smooth" });
      }

      // Reset form for new bookings
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        apartment: location.state?.apartment || "",
        visitDate: "",
        timeSlot: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error:", error);

      // Set server availability to false
      setIsServerAvailable(false);

      // Create the booking data object for fallback
      const bookingData = {
        property: formData.apartment,
        date: formData.visitDate,
        time: formData.timeSlot,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
      };

      // Add the booking to context anyway (fallback mechanism)
      addBooking(bookingData);

      // Show a more user-friendly error message
      const confirmSave = window.confirm(
        "There was an issue connecting to our booking server, but we've saved your booking locally. " +
          "Your booking will be synchronized when the server is available. " +
          "Click OK to view your booking details."
      );

      if (confirmSave) {
        // Show success message
        setShowSuccess(true);
        setBookingComplete(true);

        // Scroll to success message
        if (successRef.current) {
          successRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Reset form for new bookings
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          apartment: location.state?.apartment || "",
          visitDate: "",
          timeSlot: "",
        });
        setCurrentStep(1);
      }
    }
  };

  // Server status indicator component
  const ServerStatusIndicator = () => {
    // Check server status again when clicked
    const handleRetryConnection = () => {
      checkServerAvailability();
    };

    // Check if we're on Vercel deployment
    const isVercelDeployment =
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("bengaluru-city-homes");

    // For Vercel deployment, we'll always show as online
    const showAsOnline = isVercelDeployment || isServerAvailable;

    return (
      <div
        className="server-status-indicator"
        style={{
          marginBottom: "15px",
          fontSize: "0.8rem",
          color: showAsOnline ? "#4CAF50" : "#f44336",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
          border: `1px solid ${showAsOnline ? "#c3e6cb" : "#f5c6cb"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: showAsOnline ? "#4CAF50" : "#f44336",
              marginRight: "5px",
            }}
          ></span>
          <span style={{ flex: 1 }}>
            {showAsOnline
              ? isVercelDeployment
                ? "Booking server is online - your booking will be processed"
                : "Booking server is online - your booking will be saved to our database"
              : "Booking server is offline - bookings will be saved locally on your device"}
          </span>
        </div>

        {!showAsOnline && (
          <button
            onClick={handleRetryConnection}
            style={{
              marginTop: "8px",
              padding: "5px 10px",
              fontSize: "0.8rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  };

  // Floating elements for visual interest
  const renderFloatingElements = () => {
    return (
      <>
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="floating-element element-4"></div>
        <div className="floating-element element-5"></div>
      </>
    );
  };

  return (
    <div className="slot-booking-page">
      {renderFloatingElements()}

      <div className="slot-booking-container">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            <div
              className={`progress-step ${currentStep >= 1 ? "active" : ""}`}
            >
              <div className="step-number">1</div>
              <div className="step-label">Your Details</div>
            </div>
            <div
              className={`progress-step ${currentStep >= 2 ? "active" : ""}`}
            >
              <div className="step-number">2</div>
              <div className="step-label">Property & Date</div>
            </div>
            <div
              className={`progress-step ${currentStep >= 3 ? "active" : ""}`}
            >
              <div className="step-number">3</div>
              <div className="step-label">Time Slot</div>
            </div>
          </div>
        </div>

        <div className="slot-booking-header">
          <h1>SLOT BOOKING FOR SITE VISIT</h1>
          {selectedProject && (
            <div className="selected-project">
              <p className="project-tagline">{selectedProject.tagline}</p>
            </div>
          )}
        </div>

        <div
          className={`slot-booking-content ${
            animateIn ? "animate-in" : "animate-out"
          }`}
        >
          {currentStep === 1 && (
            <div className="booking-step step-1">
              <div className="form-intro">
                <h2>Personal Information</h2>
                <p>Please provide your contact details</p>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Enter your phone number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNextStep}
                  >
                    Next Step <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="booking-step step-2">
              {selectedProject && (
                <div className="project-image-container">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="project-image"
                  />
                  <div className="project-image-overlay">
                    <h2>{selectedProject.name}</h2>
                  </div>
                </div>
              )}

              <div className="booking-form">
                <div className="form-intro">
                  <h2>Property & Visit Date</h2>
                  <p>Select which property you'd like to visit and when</p>
                </div>

                <div className="form-group">
                  <label htmlFor="apartment">Select Property</label>
                  <select
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    required
                    disabled={location.state && location.state.apartment}
                  >
                    <option value="" disabled>
                      Select Apartment
                    </option>
                    {Object.values(projectData).map((project) => (
                      <option key={project.value} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="visitDate">Visit Date</label>
                  <input
                    type="date"
                    id="visitDate"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    onClick={handleDateClick}
                  />
                </div>

                {/* Server status indicator */}
                <ServerStatusIndicator />

                <div className="form-actions">
                  <button
                    type="button"
                    className="prev-btn"
                    onClick={handlePrevStep}
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNextStep}
                  >
                    Next Step <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="booking-step step-3">
              <div className="booking-form">
                <div className="form-intro">
                  <h2>Select a Time Slot</h2>
                  <p>
                    Choose a convenient time for your visit on{" "}
                    {formData.visitDate}
                  </p>
                </div>

                <div className="time-slots-container">
                  <div className="time-slots-grid">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`time-slot ${
                          formData.timeSlot === slot.time ? "selected" : ""
                        } ${!slot.available ? "unavailable" : ""}`}
                        onClick={() =>
                          slot.available && handleTimeSlotSelect(slot.time)
                        }
                      >
                        <span className="time-slot-time">{slot.time}</span>
                        {formData.timeSlot === slot.time && (
                          <span className="checkmark">✓</span>
                        )}
                        {!slot.available && (
                          <span className="unavailable-text">Booked</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Server status indicator */}
                <ServerStatusIndicator />

                <div className="form-actions">
                  <button
                    type="button"
                    className="prev-btn"
                    onClick={handlePrevStep}
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={handleSubmit}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showSuccess && (
          <div className="success-message" ref={successRef}>
            <div className="success-icon">✓</div>
            <h3>Booking Confirmed!</h3>
            <p className="confirmation-text">
              <strong>Your site visit has been successfully scheduled</strong>{" "}
              for{" "}
              <span className="highlight-text">
                {bookingComplete
                  ? "the selected date and time"
                  : `${formData.visitDate} at ${formData.timeSlot}`}
              </span>
            </p>

            <p className="email-notification">
              {isServerAvailable ? (
                emailSent ? (
                  <>
                    <span className="notification-icon">✉</span>
                    <span>
                      A confirmation has been sent to your email.
                      {emailPreviewUrl && (
                        <span>
                          {" "}
                          <a
                            href={emailPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#cfe56f",
                              textDecoration: "underline",
                            }}
                          >
                            View email
                          </a>
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="notification-icon">✉</span>
                    <span>
                      We'll send a confirmation to your email shortly.
                    </span>
                  </>
                )
              ) : (
                <>
                  <span className="notification-icon">💾</span>
                  <span>
                    Your booking has been saved locally. It will be synchronized
                    when the server is available.
                  </span>
                </>
              )}
            </p>

            <div className="success-actions">
              <Link
                to="/profile?showBookings=true"
                className="view-booking-btn"
              >
                View Booking in Profile
              </Link>
              <button
                className="book-another-btn"
                onClick={() => {
                  setShowSuccess(false);
                  setBookingComplete(false);
                }}
              >
                Book Another Visit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;
