import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const SavedPropertiesContext = createContext();

// Provider component
export const SavedPropertiesProvider = ({ children }) => {
  // Initialize state from localStorage or use empty array
  const [savedProperties, setSavedProperties] = useState(() => {
    const savedData = localStorage.getItem("savedProperties");
    console.log("Loading saved properties from localStorage:", savedData);
    return savedData ? JSON.parse(savedData) : [];
  });

  // Log saved properties for debugging
  useEffect(() => {
    console.log("Current saved properties:", savedProperties);
  }, [savedProperties]);

  // Update localStorage whenever savedProperties changes
  useEffect(() => {
    localStorage.setItem("savedProperties", JSON.stringify(savedProperties));
  }, [savedProperties]);

  // Function to save a property
  const saveProperty = (property) => {
    // Check if property is already saved
    const isAlreadySaved = savedProperties.some((p) => p.id === property.id);

    if (!isAlreadySaved) {
      setSavedProperties([...savedProperties, property]);
      return { success: true, message: "Property saved successfully!" };
    } else {
      return { success: false, message: "Property already saved!" };
    }
  };

  // Function to toggle save/unsave a property
  const toggleSaveProperty = (property) => {
    // Check if property is already saved
    const isAlreadySaved = savedProperties.some((p) => p.id === property.id);

    if (isAlreadySaved) {
      // Remove the property
      setSavedProperties(savedProperties.filter((p) => p.id !== property.id));
      return {
        success: true,
        saved: false,
        message: "Property removed from saved list!",
      };
    } else {
      // Save the property
      setSavedProperties([...savedProperties, property]);
      return {
        success: true,
        saved: true,
        message: "Property saved successfully!",
      };
    }
  };

  // Function to remove a property
  const removeProperty = (propertyId) => {
    setSavedProperties(savedProperties.filter((p) => p.id !== propertyId));
    return { success: true, message: "Property removed successfully!" };
  };

  // Function to check if a property is saved
  const isPropertySaved = (propertyId) => {
    return savedProperties.some((p) => p.id === propertyId);
  };

  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        saveProperty,
        removeProperty,
        isPropertySaved,
        toggleSaveProperty,
      }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  );
};

// Custom hook to use the saved properties context
export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (!context) {
    throw new Error(
      "useSavedProperties must be used within a SavedPropertiesProvider"
    );
  }
  return context;
};
