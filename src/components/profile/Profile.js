import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";
import { useSavedProperties } from "../../context/SavedPropertiesContext";
import "./Profile.css";

const Profile = () => {
  const { bookings, editBooking, removeBooking } = useBookings();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: "",
    time: "",
    property: "",
    name: "",
    contactNumber: "",
    email: "",
  });

  // Load bookings when component mounts or bookings change
  useEffect(() => {
    // Check if there are any bookings in context
    if (bookings && bookings.length > 0) {
      setBookingHistory(bookings);
      // If coming from a new booking, automatically show the bookings tab
      const params = new URLSearchParams(window.location.search);
      if (params.get("showBookings") === "true") {
        setActiveTab("bookings");
      }
    }
  }, [bookings]);

  // Initialize user data from localStorage or use default values
  const [userData, setUserData] = useState(() => {
    // Try to get user data from localStorage
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      return JSON.parse(savedUserData);
    }
    // Return default values if no saved data exists
    return {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
      address: "123, Main Street, Bangalore",
      preferences: {
        propertyType: "Apartment",
        budget: "50L - 75L",
        location: "Whitefield",
        bedrooms: "2BHK",
      },
    };
  });

  // Get saved properties from context
  const { savedProperties, removeProperty } = useSavedProperties();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedUserData = {
      ...userData,
      [name]: value,
    };

    // Update state
    setUserData(updatedUserData);
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    const updatedUserData = {
      ...userData,
      preferences: {
        ...userData.preferences,
        [name]: value,
      },
    };

    // Update state
    setUserData(updatedUserData);
  };

  // Handle save action with feedback
  const handleSave = () => {
    // Save user data to localStorage
    localStorage.setItem("userData", JSON.stringify(userData));

    // Update UI state
    setIsEditing(false);
    setSavedMessage("Changes saved successfully!");
    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  // Handle opening the edit modal for a booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      date: booking.date,
      time: booking.time,
      property: booking.property,
      name: booking.name || "",
      contactNumber: booking.contactNumber || "",
      email: booking.email || "",
    });
    setShowEditModal(true);
  };

  // Handle changes to the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle saving the edited booking
  const handleSaveEdit = () => {
    // Validate form data
    if (
      !editFormData.date ||
      !editFormData.time ||
      !editFormData.name ||
      !editFormData.contactNumber
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingBooking) {
      // Call the editBooking function from context
      const updatedBooking = editBooking(editingBooking.id, editFormData);

      // Update the booking history to reflect changes immediately
      setBookingHistory((prevHistory) =>
        prevHistory.map((booking) =>
          booking.id === editingBooking.id ? updatedBooking : booking
        )
      );

      // Close the modal and reset state
      setShowEditModal(false);
      setEditingBooking(null);

      // Show success message
      setSavedMessage("Booking updated successfully!");
      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    }
  };

  // Handle removing a booking
  const handleRemoveBooking = (id) => {
    if (removeConfirm === id) {
      // Actually remove the booking
      removeBooking(id);
      setRemoveConfirm(null);

      // Show success message
      setSavedMessage("Booking removed successfully!");
      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } else {
      setRemoveConfirm(id);
      setTimeout(() => {
        setRemoveConfirm(null);
      }, 3000);
    }
  };

  // Close the edit modal
  const handleCloseModal = () => {
    // Ask for confirmation if changes were made
    if (
      editingBooking &&
      (editFormData.date !== editingBooking.date ||
        editFormData.time !== editingBooking.time ||
        editFormData.name !== (editingBooking.name || "") ||
        editFormData.contactNumber !== (editingBooking.contactNumber || ""))
    ) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }

    setShowEditModal(false);
    setEditingBooking(null);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span>{userData.name.charAt(0)}</span>
          </div>
          <h2>{userData.name}</h2>
        </div>
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Slot Booking Details
          </button>
          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Properties
          </button>
          <button
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>
      </div>

      <div className="profile-content">
        {savedMessage && (
          <div className="save-notification">
            <p>{savedMessage}</p>
          </div>
        )}

        {activeTab === "personal" && (
          <div className="personal-info">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button
                className="edit-btn"
                onClick={() => {
                  if (isEditing) {
                    // If currently editing, save the data
                    handleSave();
                  } else {
                    // If not editing, enter edit mode
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.name}</p>
                )}
              </div>
              <div className="info-item">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>
              <div className="info-item">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.phone}</p>
                )}
              </div>
              <div className="info-item">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.address}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-section">
            <h3>Slot Booking Details</h3>
            {bookingHistory.length > 0 ? (
              <div className="bookings-grid">
                {bookingHistory.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h4>{booking.property}</h4>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p>
                        <strong>Date</strong> {booking.date}
                      </p>
                      <p>
                        <strong>Time</strong> {booking.time}
                      </p>
                      {booking.name && (
                        <p>
                          <strong>Name</strong> {booking.name}
                        </p>
                      )}
                      {booking.contactNumber && (
                        <p>
                          <strong>Contact </strong> {booking.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="booking-actions">
                      <button
                        className="edit-slot-btn"
                        onClick={() => handleEditBooking(booking)}
                      >
                        ✏️ Edit Slot
                      </button>
                      <button
                        className={`remove-slot-btn ${
                          removeConfirm === booking.id ? "confirm" : ""
                        }`}
                        onClick={() => handleRemoveBooking(booking.id)}
                      >
                        {removeConfirm === booking.id
                          ? "✓ Confirm Remove"
                          : "🗑️ Remove Slot"}
                      </button>
                      <Link
                        to={`/project/${booking.property
                          .toLowerCase()
                          .replace(/\\s+/g, "-")}`}
                        className="view-property-btn"
                      >
                        🏠 View Property
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings-message">
                <p>You haven't made any site visit bookings yet.</p>
                <Link to="/slot-booking" className="book-now-btn">
                  Book a Site Visit Now
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="saved-properties">
            <div className="section-header">
              <h3>Saved Properties</h3>
            </div>
            {savedProperties && savedProperties.length > 0 ? (
              <div className="properties-grid">
                {savedProperties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div
                      className="property-image"
                      style={{ backgroundImage: `url(${property.image})` }}
                    ></div>
                    <div className="property-info">
                      <h4>{property.name}</h4>
                      <p className="property-type">{property.type}</p>
                      <p className="property-price">{property.price}</p>
                      <p className="property-location">{property.location}</p>
                    </div>
                    <div className="property-actions">
                      <Link
                        to={`/project/${property.name
                          .toLowerCase()
                          .replace(/\\s+/g, "-")}`}
                        className="view-btn"
                      >
                        View Details
                      </Link>
                      <button
                        className="remove-btn"
                        onClick={() => {
                          removeProperty(property.id);
                          setSavedMessage("Property removed successfully!");
                          setTimeout(() => {
                            setSavedMessage("");
                          }, 3000);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-saved-properties">
                <p>You haven't saved any properties yet.</p>
                <Link to="/" className="browse-properties-btn">
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="preferences-section">
            <div className="section-header">
              <h3>Property Preferences</h3>
              <button
                className="edit-btn"
                onClick={() => {
                  if (isEditing) {
                    // If currently editing, save the data
                    handleSave();
                  } else {
                    // If not editing, enter edit mode
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>Property Type</label>
                {isEditing ? (
                  <select
                    name="propertyType"
                    value={userData.preferences.propertyType}
                    onChange={handlePreferenceChange}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                  </select>
                ) : (
                  <p>{userData.preferences.propertyType}</p>
                )}
              </div>
              <div className="preference-item">
                <label>Budget Range</label>
                {isEditing ? (
                  <select
                    name="budget"
                    value={userData.preferences.budget}
                    onChange={handlePreferenceChange}
                  >
                    <option value="Under 50L">Under 50L</option>
                    <option value="50L - 75L">50L - 75L</option>
                    <option value="75L - 1Cr">75L - 1Cr</option>
                    <option value="Above 1Cr">Above 1Cr</option>
                  </select>
                ) : (
                  <p>{userData.preferences.budget}</p>
                )}
              </div>
              <div className="preference-item">
                <label>Preferred Location</label>
                {isEditing ? (
                  <select
                    name="location"
                    value={userData.preferences.location}
                    onChange={handlePreferenceChange}
                  >
                    <option value="Whitefield">Whitefield</option>
                    <option value="Electronic City">Electronic City</option>
                    <option value="Horamavu">Horamavu</option>
                    <option value="Sarjapur Road">Sarjapur Road</option>
                  </select>
                ) : (
                  <p>{userData.preferences.location}</p>
                )}
              </div>
              <div className="preference-item">
                <label>Bedrooms</label>
                {isEditing ? (
                  <select
                    name="bedrooms"
                    value={userData.preferences.bedrooms}
                    onChange={handlePreferenceChange}
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                  </select>
                ) : (
                  <p>{userData.preferences.bedrooms}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Booking Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Booking</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Property</label>
                <input
                  type="text"
                  name="property"
                  value={editFormData.property}
                  onChange={handleEditFormChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Visit Date</label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditFormChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <select
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditFormChange}
                  required
                  className="time-slot-select"
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00 AM - 10:00 AM">
                    09:00 AM - 10:00 AM
                  </option>
                  <option value="10:00 AM - 11:00 AM">
                    10:00 AM - 11:00 AM
                  </option>
                  <option value="11:00 AM - 12:00 PM">
                    11:00 AM - 12:00 PM
                  </option>
                  <option value="12:00 PM - 01:00 PM">
                    12:00 PM - 01:00 PM
                  </option>
                  <option value="02:00 PM - 03:00 PM">
                    02:00 PM - 03:00 PM
                  </option>
                  <option value="03:00 PM - 04:00 PM">
                    03:00 PM - 04:00 PM
                  </option>
                  <option value="04:00 PM - 05:00 PM">
                    04:00 PM - 05:00 PM
                  </option>
                  <option value="05:00 PM - 06:00 PM">
                    05:00 PM - 06:00 PM
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={editFormData.contactNumber}
                  onChange={handleEditFormChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
              </div>
              {editFormData.email && (
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    disabled
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                ✕ Cancel
              </button>
              <button className="save-btn" onClick={handleSaveEdit}>
                ✓ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
