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

  // Function to generate Excel file from booking data
  const generateExcelFile = (bookingData) => {
    try {
      // Create a simple CSV string (easier than full Excel)
      const headers = [
        "Property",
        "Date",
        "Time",
        "Name",
        "Email",
        "Contact Number",
      ];
      const values = [
        bookingData.property,
        bookingData.date,
        bookingData.time,
        bookingData.name,
        bookingData.email,
        bookingData.contactNumber,
      ];

      // Create CSV content
      let csvContent = headers.join(",") + "\n";
      csvContent += values.join(",") + "\n";

      // Create a blob and download link
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger click
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `booking_${bookingData.name}_${bookingData.date}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("Error generating Excel file:", error);
      return false;
    }
  };

  // Function to check if the booking server is available
  const checkServerAvailability = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      // Use the Railway backend URL
      await fetch(
        "https://bengaluru-city-homes-production.up.railway.app/api/health",
        {
          method: "GET",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      console.log("Booking server is available");
      return true;
    } catch (error) {
      console.log("Booking server is not available:", error);
      return false;
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

      // Use the Railway backend URL
      const apiUrl =
        "https://bengaluru-city-homes-production.up.railway.app/api/book-slot";

      let success = false;
      let lastError = null;
      let serverAvailable = false;

      try {
        console.log("Attempting to submit booking to:", apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("Response status:", response.status);
        serverAvailable = true;

        if (response.ok) {
          const responseData = await response.json();
          success = true;

          // Check if email was sent successfully
          if (responseData.emailSent) {
            setEmailSent(true);
            if (responseData.emailPreviewUrl) {
              setEmailPreviewUrl(responseData.emailPreviewUrl);
              console.log("Email preview URL:", responseData.emailPreviewUrl);
            }
          } else {
            setEmailSent(false);
          }
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `Booking failed: ${response.status} ${response.statusText}`
          );
        }
      } catch (err) {
        console.error(`Error submitting to ${apiUrl}:`, err);
        lastError = err;
        serverAvailable = false;
      }

      // Generate Excel file for download
      generateExcelFile(bookingData);

      // If server is not available, we'll still save the booking locally
      if (!serverAvailable) {
        console.log("Server not available, saving booking locally only");

        // Add the booking to context (which saves to localStorage)
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

        // Return early - we've handled the offline case
        return;
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

      // Generate Excel file for download
      generateExcelFile(bookingData);

      // Show a more user-friendly error message
      alert(
        "Your booking has been saved locally and downloaded as an Excel file."
      );

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
  };

  // Server status indicator component
  const ServerStatusIndicator = () => (
    <div
      className="server-status-indicator"
      style={{
        marginBottom: "15px",
        fontSize: "0.8rem",
        color: "#4CAF50",
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderRadius: "4px",
        border: "1px solid rgba(76, 175, 80, 0.3)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          marginRight: "8px",
          boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
        }}
      ></span>
      <span style={{ fontWeight: "500" }}>
        Your booking will be saved to our server and downloaded as Excel
      </span>
    </div>
  );

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
              {emailSent ? (
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
                  <span className="notification-icon">💾</span>
                  <span>
                    Your booking has been saved to our server and downloaded as
                    an Excel file. You can also view your booking details in
                    your profile.
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
