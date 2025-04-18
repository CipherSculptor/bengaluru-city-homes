import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const BookingContext = createContext();

// Custom hook to use the booking context
export const useBookings = () => useContext(BookingContext);

// Provider component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Load bookings from localStorage on initial render
  useEffect(() => {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // Add a new booking
  const addBooking = (booking) => {
    // Create a new booking with ID and timestamp
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: "confirmed",
      bookingTime: new Date().toISOString(),
    };

    // Update state and localStorage
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    return newBooking;
  };

  // Edit an existing booking
  const editBooking = (id, updatedData) => {
    // Find the booking to update
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, ...updatedData } : booking
    );

    // Update state and localStorage
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    return updatedBookings.find((booking) => booking.id === id);
  };

  // Remove a booking
  const removeBooking = (id) => {
    // Filter out the booking to remove
    const updatedBookings = bookings.filter((booking) => booking.id !== id);

    // Update state and localStorage
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    return true;
  };

  // Get all bookings
  const getBookings = () => {
    return bookings;
  };

  // The context value
  const value = {
    bookings,
    addBooking,
    editBooking,
    removeBooking,
    getBookings,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export default BookingContext;
