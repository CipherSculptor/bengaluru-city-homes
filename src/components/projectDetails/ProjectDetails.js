import React, { useEffect, useState } from "react";
import "./ProjectDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import mainImage from "../../assets/JSN_signature_Images/MainImage.png";
import buildingImage from "../../assets/JSN_signature_Images/image 2.png";
import buildingImage2 from "../../assets/JSN_signature_Images/image 3.png";
import buildingImage3 from "../../assets/JSN_signature_Images/image 4.png";
import buildingImage4 from "../../assets/JSN_signature_Images/image 5.png";
import buildingImage5 from "../../assets/JSN_signature_Images/image 6.png";
import floorPlan1 from "../../assets/JSN_signature_Images/Screenshot 2025-04-02 at 09.55.03 1.png";
import floorPlan2 from "../../assets/JSN_signature_Images/Screenshot 2025-04-02 at 09.56.32 1.png";
import floorPlan3 from "../../assets/JSN_signature_Images/Screenshot 2025-04-02 at 09.57.36 1.png";
import sunshineMainImage from "../../assets/JSN_sunshine_images/main.png";
import sunshineFloorPlan1 from "../../assets/JSN_sunshine_images/Screenshot 2025-04-02 at 12.26.16 1.png";
import sunshineFloorPlan2 from "../../assets/JSN_sunshine_images/Screenshot 2025-04-02 at 12.27.29 1.png";
import sunshineFloorPlan3 from "../../assets/JSN_sunshine_images/Screenshot 2025-04-02 at 12.28.41 1.png";
import slvEnclaveMain from "../../assets/slv_enclave/Main.png";
import slvEnclaveFloorPlan1 from "../../assets/slv_enclave/Screenshot 2025-04-07 at 11.11.21.png";
import slvEnclaveFloorPlan2 from "../../assets/slv_enclave/Screenshot 2025-04-07 at 11.12.13.png";
import slvEnclaveFloorPlan3 from "../../assets/slv_enclave/Screenshot 2025-04-07 at 11.12.33.png";
import slvEnclaveFloorPlan4 from "../../assets/slv_enclave/Screenshot 2025-04-07 at 11.12.51.png";
import slvEnclaveFloorPlan5 from "../../assets/slv_enclave/Screenshot 2025-04-07 at 11.13.17.png";
import Footer from "../layout/Footer";
import { useSavedProperties } from "../../context/SavedPropertiesContext";

// Remove the console.log

const projectData = {
  "jsn-signature": {
    id: 1,
    name: "JSN Signature",
    tagline: "PREMIUM 2&3BHK APARTMENTS",
    startingPrice: "80-90 Lakhs",
    pricePerSqFt: "Average of 7,200 Per sq.ft",
    images: [
      mainImage, // Using the renamed MainImage.png as the default first image
      floorPlan1,
      floorPlan2,
      floorPlan3,
      buildingImage5,
    ],
    description:
      "JSN Signature by JSN Builders presents 2 & 3 BHK homes in Horamavu, crafted for comfort and Vaastu. This prime North Bengaluru location, near Orchids International School, offers excellent connectivity. An ideal investment, JSN Signature delivers value with quality construction and proximity to IT Hubs and the airport.",
    features: ["BBMP APPROVED", "AS PER VAASTHU"],
    highlights: [
      {
        icon: "🏢",
        title: "Structure",
        description: "RCC framed structure with high-quality materials",
      },
      {
        icon: "🧱",
        title: "Walls",
        description: "Solid block masonry with superior plastering",
      },
      {
        icon: "🚪",
        title: "Doors",
        description: "Teak wood frames with designer panel doors",
      },
      {
        icon: "🪟",
        title: "Windows",
        description: "UPVC windows with MS grills and mosquito mesh",
      },
      {
        icon: "🛁",
        title: "Bathrooms",
        description: "Premium sanitary fixtures and CP fittings",
      },
      {
        icon: "⚡",
        title: "Electrical",
        description: "Concealed copper wiring with modular switches",
      },
    ],
    amenities: [
      { icon: "🏋️‍♂️", name: "Fitness Center" },
      { icon: "👶", name: "Children's Play Area" },
      { icon: "🌳", name: "Landscaped Gardens" },
      { icon: "🧘‍♀️", name: "Yoga Deck" },
      { icon: "🎭", name: "Multipurpose Hall" },
      { icon: "👮‍♂️", name: "24/7 Security" },
      { icon: "🚗", name: "Covered Parking" },
      { icon: "🛒", name: "Convenience Store" },
    ],
    location: {
      address: "Horamavu, North Bengaluru",
      nearbyPlaces: [
        {
          type: "school",
          name: "Orchids International School",
          distance: "0.5 km",
        },
        {
          type: "hospital",
          name: "Bangalore Baptist Hospital",
          distance: "3 km",
        },
        { type: "mall", name: "Phoenix Marketcity", distance: "7 km" },
        { type: "it_park", name: "Manyata Tech Park", distance: "6 km" },
        {
          type: "airport",
          name: "Kempegowda International Airport",
          distance: "25 km",
        },
      ],
    },
    pricing: {
      units: [
        { type: "2 BHK", size: "1100 sq.ft", price: "80 Lakhs" },
        { type: "3 BHK", size: "1450 sq.ft", price: "90 Lakhs" },
      ],
      paymentPlans: [
        {
          name: "Standard Plan",
          description: "20% booking, 80% on possession",
        },
        {
          name: "Construction-Linked",
          description: "Pay as per construction stages",
        },
        {
          name: "Down Payment",
          description: "7% discount on 90% down payment",
        },
      ],
      offers: [
        { icon: "🎁", text: "No floor rise charges for limited time" },
        { icon: "🏠", text: "Free modular kitchen on booking" },
        { icon: "💸", text: "Zero stamp duty for first 10 bookings" },
      ],
      additionalCosts: [
        { name: "GST", value: "5%" },
        { name: "Registration", value: "₹ 60,000" },
        {
          name: "Maintenance (Advance)",
          value: "₹ 2.5/sq.ft per month for 24 months",
        },
        { name: "Legal Charges", value: "₹ 15,000" },
      ],
    },
  },
  "jsn-sunshine": {
    id: 2,
    name: "JSN SunShine",
    tagline: "PREMIUM 2&3BHK APARTMENTS",
    startingPrice: "80-90 Lakhs",
    pricePerSqFt: "Average of 7,300 Per sq.ft",
    images: [
      sunshineMainImage, // Using the main.png as the default first image
      sunshineFloorPlan1,
      sunshineFloorPlan2,
      sunshineFloorPlan3,
    ],
    description:
      "Discover JSN Sunshine, an ideal North Bengaluru investment featuring 2 & 3 BHK homes designed for comfort and Vaastu. Developed by JSN Builders, this property in Horamavu, Rajanna Layout, is conveniently located near Banaswadi Outer Ring Road Junction. Benefit from quality construction and excellent connectivity to IT Hubs and the airport.",
    features: ["BBMP APPROVED", "AS PER VAASTHU"],
    highlights: [
      {
        icon: "🏢",
        title: "Structure",
        description: "RCC framed structure with high-quality materials",
      },
      {
        icon: "🧱",
        title: "Walls",
        description: "Solid block masonry with superior plastering",
      },
      {
        icon: "🚪",
        title: "Doors",
        description: "Teak wood frames with designer panel doors",
      },
      {
        icon: "🪟",
        title: "Windows",
        description: "UPVC windows with MS grills and mosquito mesh",
      },
      {
        icon: "🛁",
        title: "Bathrooms",
        description: "Premium sanitary fixtures and CP fittings",
      },
      {
        icon: "⚡",
        title: "Electrical",
        description: "Concealed copper wiring with modular switches",
      },
    ],
    amenities: [
      { icon: "🏊‍♂️", name: "Swimming Pool" },
      { icon: "🏋️‍♂️", name: "Fitness Center" },
      { icon: "🎮", name: "Indoor Games" },
      { icon: "👶", name: "Children's Play Area" },
      { icon: "🌳", name: "Landscaped Gardens" },
      { icon: "🚶‍♂️", name: "Jogging Track" },
      { icon: "🧘‍♀️", name: "Yoga Deck" },
      { icon: "🎭", name: "Multipurpose Hall" },
      { icon: "👮‍♂️", name: "24/7 Security" },
      { icon: "🚗", name: "Covered Parking" },
      { icon: "🛋️", name: "Clubhouse" },
      { icon: "🛒", name: "Convenience Store" },
    ],
    location: {
      address: "Horamavu, Rajanna Layout, North Bengaluru",
      nearbyPlaces: [
        {
          type: "school",
          name: "Orchids International School",
          distance: "0.8 km",
        },
        {
          type: "hospital",
          name: "Bangalore Baptist Hospital",
          distance: "2.5 km",
        },
        { type: "mall", name: "Phoenix Marketcity", distance: "6 km" },
        { type: "it_park", name: "Manyata Tech Park", distance: "5 km" },
        {
          type: "airport",
          name: "Kempegowda International Airport",
          distance: "28 km",
        },
      ],
    },
    pricing: {
      units: [
        { type: "2 BHK", size: "1050 sq.ft", price: "80 Lakhs" },
        { type: "3 BHK", size: "1400 sq.ft", price: "90 Lakhs" },
      ],
      paymentPlans: [
        {
          name: "Standard Plan",
          description: "20% booking, 80% on possession",
        },
        {
          name: "Construction-Linked",
          description: "Pay as per construction stages",
        },
        {
          name: "Down Payment",
          description: "7% discount on 90% down payment",
        },
      ],
      offers: [
        { icon: "🎁", text: "No floor rise charges for limited time" },
        { icon: "🏠", text: "Free modular kitchen on booking" },
        { icon: "💸", text: "Zero stamp duty for first 10 bookings" },
      ],
      additionalCosts: [
        { name: "GST", value: "5%" },
        { name: "Registration", value: "₹ 60,000" },
        {
          name: "Maintenance (Advance)",
          value: "₹ 2.5/sq.ft per month for 24 months",
        },
        { name: "Legal Charges", value: "₹ 15,000" },
      ],
    },
  },
  "slv-enclave": {
    id: 3,
    name: "SLV Enclave",
    tagline: "LUXURY 2&3BHK APARTMENTS",
    startingPrice: "80-90 Lakhs",
    pricePerSqFt: "Average of 7,500 Per sq.ft",
    images: [
      slvEnclaveMain,
      slvEnclaveFloorPlan1,
      slvEnclaveFloorPlan2,
      slvEnclaveFloorPlan3,
      slvEnclaveFloorPlan4,
      slvEnclaveFloorPlan5,
    ],
    description:
      "SLV Enclave offers premium 2 & 3 BHK apartments in Kodigehalli, KR Puram, designed for modern urban living. Located in one of Bengaluru's fastest-growing neighborhoods, this project provides excellent connectivity to major tech parks, business centers, and educational institutions. Experience elegant living with top-quality construction and thoughtfully designed living spaces.",
    features: ["BBMP APPROVED", "AS PER VAASTHU"],
    highlights: [
      {
        icon: "🏢",
        title: "Structure",
        description: "RCC framed structure with premium quality materials",
      },
      {
        icon: "🧱",
        title: "Walls",
        description: "Solid block masonry with premium plastering",
      },
      {
        icon: "🚪",
        title: "Doors",
        description: "Premium hardwood frames with designer doors",
      },
      {
        icon: "🪟",
        title: "Windows",
        description: "UPVC windows with MS grills and mosquito mesh",
      },
      {
        icon: "🛁",
        title: "Bathrooms",
        description: "Premium imported sanitary fixtures and CP fittings",
      },
      {
        icon: "⚡",
        title: "Electrical",
        description: "Concealed copper wiring with modular switches",
      },
    ],
    amenities: [
      { icon: "🏊‍♂️", name: "Swimming Pool" },
      { icon: "🏋️‍♂️", name: "Fitness Center" },
      { icon: "🎮", name: "Indoor Games" },
      { icon: "👶", name: "Children's Play Area" },
      { icon: "🌳", name: "Landscaped Gardens" },
      { icon: "🚶‍♂️", name: "Jogging Track" },
      { icon: "🧘‍♀️", name: "Yoga Deck" },
      { icon: "🎭", name: "Multipurpose Hall" },
      { icon: "👮‍♂️", name: "24/7 Security" },
      { icon: "🚗", name: "Covered Parking" },
      { icon: "🛋️", name: "Clubhouse" },
      { icon: "🛒", name: "Convenience Store" },
    ],
    location: {
      address: "Kodigehalli, KR Puram, Bengaluru",
      nearbyPlaces: [
        { type: "school", name: "Delhi Public School", distance: "1.2 km" },
        {
          type: "hospital",
          name: "Columbia Asia Hospital",
          distance: "3.5 km",
        },
        { type: "mall", name: "Phoenix Marketcity", distance: "5 km" },
        { type: "it_park", name: "Bagmane Tech Park", distance: "4.5 km" },
        {
          type: "airport",
          name: "Kempegowda International Airport",
          distance: "32 km",
        },
      ],
    },
    pricing: {
      units: [
        { type: "2 BHK", size: "1150 sq.ft", price: "80 Lakhs" },
        { type: "3 BHK", size: "1550 sq.ft", price: "90 Lakhs" },
      ],
      paymentPlans: [
        {
          name: "Standard Plan",
          description: "20% booking, 80% on possession",
        },
        {
          name: "Construction-Linked",
          description: "Pay as per construction stages",
        },
        {
          name: "Down Payment",
          description: "8% discount on 90% down payment",
        },
      ],
      offers: [
        { icon: "🎁", text: "No floor rise charges for limited time" },
        { icon: "🏠", text: "Free modular kitchen on booking" },
        { icon: "💸", text: "Stamp duty waiver for first 15 bookings" },
      ],
      additionalCosts: [
        { name: "GST", value: "5%" },
        { name: "Registration", value: "₹ 65,000" },
        {
          name: "Maintenance (Advance)",
          value: "₹ 3/sq.ft per month for 24 months",
        },
        { name: "Legal Charges", value: "₹ 18,000" },
      ],
    },
  },
};

// Bank data with interest rates
const bankData = [
  { id: "sbi", name: "State Bank of India", interestRate: 8.55 },
  { id: "hdfc", name: "HDFC Bank", interestRate: 8.75 },
  { id: "icici", name: "ICICI Bank", interestRate: 8.65 },
  { id: "axis", name: "Axis Bank", interestRate: 8.7 },
  { id: "bob", name: "Bank of Baroda", interestRate: 8.5 },
  { id: "pnb", name: "Punjab National Bank", interestRate: 8.4 },
  { id: "kotak", name: "Kotak Mahindra Bank", interestRate: 8.85 },
  { id: "idfc", name: "IDFC First Bank", interestRate: 8.3 },
  { id: "canara", name: "Canara Bank", interestRate: 8.45 },
  { id: "ubi", name: "Union Bank of India", interestRate: 8.35 },
  { id: "boi", name: "Bank of India", interestRate: 8.6 },
  { id: "iob", name: "Indian Overseas Bank", interestRate: 8.65 },
  { id: "indusind", name: "IndusInd Bank", interestRate: 8.8 },
  { id: "yes", name: "Yes Bank", interestRate: 8.75 },
  { id: "federal", name: "Federal Bank", interestRate: 8.45 },
  { id: "rbl", name: "RBL Bank", interestRate: 8.9 },
  { id: "indian", name: "Indian Bank", interestRate: 8.55 },
  { id: "cbi", name: "Central Bank of India", interestRate: 8.45 },
  { id: "scb", name: "Standard Chartered Bank", interestRate: 8.95 },
  { id: "deutsche", name: "Deutsche Bank", interestRate: 9.0 },
  { id: "hsbc", name: "HSBC Bank", interestRate: 8.65 },
  { id: "dbs", name: "DBS Bank", interestRate: 8.7 },
  { id: "citi", name: "Citibank", interestRate: 8.85 },
  { id: "lic", name: "LIC Housing Finance", interestRate: 8.5 },
  { id: "pnbhfl", name: "PNB Housing Finance", interestRate: 8.6 },
  { id: "indiabulls", name: "Indiabulls Housing Finance", interestRate: 8.75 },
  { id: "tata", name: "Tata Capital Housing Finance", interestRate: 8.7 },
  { id: "bajaj", name: "Bajaj Housing Finance", interestRate: 8.65 },
  { id: "aditya", name: "Aditya Birla Housing Finance", interestRate: 8.8 },
  { id: "reliance", name: "Reliance Home Finance", interestRate: 8.85 },
];

// EMI Calculator Component
const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = React.useState(6000000); // 60 Lakhs
  const [selectedBank, setSelectedBank] = React.useState("sbi");
  const [interestRate, setInterestRate] = React.useState(8.55); // Default to SBI rate
  const [loanTerm, setLoanTerm] = React.useState(20); // 20 years
  const [emi, setEmi] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  React.useEffect(() => {
    // Set last updated date to current date when component mounts
    const currentDate = new Date();
    setLastUpdated(
      currentDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // This function would actually fetch real-time rates in a production environment
  const fetchRealTimeRates = () => {
    setIsLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // In a real implementation, this would be replaced with an actual API call
      // const response = await fetch('https://api.example.com/interest-rates');
      // const data = await response.json();

      // For demo, we'll just update the last updated timestamp
      const currentDate = new Date();
      setLastUpdated(
        currentDate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );

      setIsLoading(false);
    }, 1500);
  };

  // Filter banks based on search term
  const filteredBanks = bankData.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update interest rate when bank is selected
  const handleBankChange = (bankId) => {
    setSelectedBank(bankId);
    const bank = bankData.find((bank) => bank.id === bankId);
    setInterestRate(bank.interestRate);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;

    // EMI formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setEmi(Math.round(emiValue));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get selected bank name
  const selectedBankName =
    bankData.find((bank) => bank.id === selectedBank)?.name || "";

  return (
    <div className="emi-calculator">
      <div className="emi-header">
        <h2>EMI Calculator</h2>
        <div className="rates-info">
          <button
            onClick={fetchRealTimeRates}
            disabled={isLoading}
            className="refresh-rates-btn"
          >
            {isLoading ? "Updating..." : "Refresh Rates"}
          </button>
          {lastUpdated && (
            <div className="last-updated">
              Rates as of {lastUpdated} (approximate)
            </div>
          )}
        </div>
      </div>

      <div className="calculator-control">
        <label>Loan Amount (₹)</label>
        <input
          type="range"
          min="1000000"
          max="15000000"
          step="100000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(parseInt(e.target.value))}
        />
        <div className="range-values">
          <span>{formatCurrency(loanAmount)}</span>
        </div>
      </div>

      <div className="calculator-control">
        <label>Select Bank</label>
        <div className="bank-select-container" ref={dropdownRef}>
          <div
            className="bank-select-display"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedBankName}</span>
            <span className="dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
          </div>

          {isDropdownOpen && (
            <div className="bank-select-dropdown">
              <div className="bank-search">
                <input
                  type="text"
                  placeholder="Search banks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className="bank-options">
                {filteredBanks.map((bank) => (
                  <div
                    key={bank.id}
                    className={`bank-option ${
                      selectedBank === bank.id ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBankChange(bank.id);
                    }}
                  >
                    <span className="bank-name">{bank.name}</span>
                    <span className="bank-rate">{bank.interestRate}%</span>
                  </div>
                ))}
                {filteredBanks.length === 0 && (
                  <div className="no-results">No banks found</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="interest-rate-display">
          <span>Interest Rate: {interestRate}%</span>
          <span className="disclaimer">(approximate)</span>
        </div>
      </div>

      <div className="calculator-control">
        <label>Loan Term (Years)</label>
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={loanTerm}
          onChange={(e) => setLoanTerm(parseInt(e.target.value))}
        />
        <div className="range-values">
          <span>{loanTerm} years</span>
        </div>
      </div>

      <div className="emi-result">
        <h3>Your Monthly EMI</h3>
        <p className="emi-amount">{formatCurrency(emi)}</p>
        <div className="emi-disclaimer">
          *Actual rates may vary. Please contact the bank for current rates.
        </div>
      </div>
    </div>
  );
};

// Price Breakdown Component
const PriceBreakdown = ({ projectData }) => {
  return (
    <div className="price-breakdown">
      <div className="unit-types">
        {projectData.pricing.units.map((unit, index) => (
          <div key={index} className="unit-type">
            <div className="unit-type-header">
              <span className="unit-type-name">{unit.type}</span>
              <span className="unit-type-size">{unit.size}</span>
            </div>
            <div className="unit-type-price">{unit.price}</div>
          </div>
        ))}
      </div>

      <div className="pricing-details">
        <h3>Payment Plans</h3>
        <div className="payment-plans">
          {projectData.pricing.paymentPlans.map((plan, index) => (
            <div key={index} className="payment-plan">
              <div className="plan-name">{plan.name}</div>
              <div className="plan-description">{plan.description}</div>
            </div>
          ))}
        </div>

        <h3>Special Offers</h3>
        <div className="special-offers">
          {projectData.pricing.offers.map((offer, index) => (
            <div key={index} className="special-offer">
              <span className="offer-icon">{offer.icon}</span>
              <span className="offer-text">{offer.text}</span>
            </div>
          ))}
        </div>

        <h3>Additional Costs</h3>
        <div className="additional-costs">
          {projectData.pricing.additionalCosts.map((cost, index) => (
            <div key={index} className="cost-item">
              <span className="cost-name">{cost.name}</span>
              <span className="cost-value">{cost.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add AreaStatement component definition after PriceBreakdown component
const AreaStatement = ({ projectId }) => {
  console.log("ProjectId in AreaStatement:", projectId); // Debug log

  // Different table data for each project
  const isSunshine = projectId === "jsn-sunshine";
  const isSlvEnclave = projectId === "slv-enclave";

  const renderGroundFloorTable = () => {
    return (
      <>
        <h3 className="floor-plan-title">
          GROUND FLOOR PLAN AREA STATEMENT IN SFT
        </h3>
        <div className="area-table-container">
          <table className="area-table detailed-area-table">
            <thead>
              <tr>
                <th>UNIT-#</th>
                <th>01</th>
                <th>02</th>
                <th>03</th>
                <th>04</th>
                <th>05</th>
                <th>06</th>
                <th>07</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-header">SB-AREA</td>
                <td>1120</td>
                <td>1175</td>
                <td>1175</td>
                <td>1247</td>
                <td>1157</td>
                <td>1218</td>
                <td>1343</td>
              </tr>
              <tr>
                <td className="row-header">FACING</td>
                <td>WEST</td>
                <td>EAST</td>
                <td>EAST</td>
                <td>EAST</td>
                <td>EAST</td>
                <td>WEST</td>
                <td>EAST</td>
              </tr>
              <tr>
                <td className="row-header">BHK</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="area-table-container" style={{ marginTop: "20px" }}>
          <table className="area-table detailed-area-table">
            <thead>
              <tr>
                <th>UNIT-#</th>
                <th>08</th>
                <th>09</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-header">SB-AREA</td>
                <td>1366</td>
                <td>1390</td>
                <td>1110</td>
                <td>1105</td>
                <td>1133</td>
                <td>1105</td>
                <td>1486</td>
              </tr>
              <tr>
                <td className="row-header">FACING</td>
                <td>EAST</td>
                <td>EAST</td>
                <td>NORTH</td>
                <td>NORTH</td>
                <td>NORTH</td>
                <td>NORTH</td>
                <td>EAST</td>
              </tr>
              <tr>
                <td className="row-header">BHK</td>
                <td>3</td>
                <td>3</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="area-statement">
      <h2>Area Statement</h2>
      <p className="area-description">
        {isSunshine
          ? "JSN Sunshine - Unit-wise area details across floors"
          : isSlvEnclave
          ? "SLV Enclave - Detailed unit specifications"
          : "JSN Signature - Unit-wise area details across floors"}
      </p>

      {isSlvEnclave ? (
        renderGroundFloorTable()
      ) : (
        <div className="area-table-container">
          <table className="area-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>FLOORS</th>
                <th colSpan={isSunshine ? "6" : "8"}>
                  SALEABLE AREA IN SQ.FT.
                </th>
              </tr>
            </thead>
            <tbody>
              {isSunshine ? (
                // JSN Sunshine area data
                <>
                  <tr>
                    <td>1.</td>
                    <td>Ground Floor</td>
                    <td>
                      001
                      <br />
                      1400
                    </td>
                    <td>
                      002
                      <br />
                      1350
                    </td>
                    <td>
                      003
                      <br />
                      1310
                    </td>
                    <td>
                      004
                      <br />
                      1270
                    </td>
                    <td>
                      005
                      <br />
                      1020
                    </td>
                    <td>
                      006
                      <br />
                      1030
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>First Floor</td>
                    <td>
                      101
                      <br />
                      1400
                    </td>
                    <td>
                      102
                      <br />
                      1350
                    </td>
                    <td>
                      103
                      <br />
                      1310
                    </td>
                    <td>
                      104
                      <br />
                      1270
                    </td>
                    <td>
                      105
                      <br />
                      1020
                    </td>
                    <td>
                      106
                      <br />
                      1030
                    </td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>Second Floor</td>
                    <td>
                      201
                      <br />
                      1400
                    </td>
                    <td>
                      202
                      <br />
                      1350
                    </td>
                    <td>
                      203
                      <br />
                      1310
                    </td>
                    <td>
                      204
                      <br />
                      1270
                    </td>
                    <td>
                      205
                      <br />
                      1020
                    </td>
                    <td>
                      206
                      <br />
                      1030
                    </td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td>Third Floor</td>
                    <td>
                      301
                      <br />
                      1400
                    </td>
                    <td>
                      302
                      <br />
                      1350
                    </td>
                    <td>
                      303
                      <br />
                      1310
                    </td>
                    <td>
                      304
                      <br />
                      1270
                    </td>
                    <td>
                      305
                      <br />
                      1020
                    </td>
                    <td>
                      306
                      <br />
                      1030
                    </td>
                  </tr>
                  <tr>
                    <td>5.</td>
                    <td>Fourth Floor</td>
                    <td>
                      401
                      <br />
                      1400
                    </td>
                    <td>
                      402
                      <br />
                      1350
                    </td>
                    <td>
                      403
                      <br />
                      1310
                    </td>
                    <td>
                      404
                      <br />
                      1270
                    </td>
                    <td>
                      405
                      <br />
                      1020
                    </td>
                    <td>
                      406
                      <br />
                      1030
                    </td>
                  </tr>
                </>
              ) : (
                // JSN Signature area data
                <>
                  <tr>
                    <td>1.</td>
                    <td>Ground Floor</td>
                    <td>
                      001
                      <br />
                      1321
                    </td>
                    <td>
                      002
                      <br />
                      1117
                    </td>
                    <td>
                      003
                      <br />
                      1308
                    </td>
                    <td>
                      004
                      <br />
                      1372
                    </td>
                    <td>
                      005
                      <br />
                      1372
                    </td>
                    <td>
                      006
                      <br />
                      1166
                    </td>
                    <td>
                      007
                      <br />
                      1356
                    </td>
                    <td>
                      008
                      <br />
                      1308
                    </td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>First Floor</td>
                    <td>
                      101
                      <br />
                      1321
                    </td>
                    <td>
                      102
                      <br />
                      1117
                    </td>
                    <td>
                      103
                      <br />
                      1308
                    </td>
                    <td>
                      104
                      <br />
                      1372
                    </td>
                    <td>
                      105
                      <br />
                      1372
                    </td>
                    <td>
                      106
                      <br />
                      1166
                    </td>
                    <td>
                      107
                      <br />
                      1356
                    </td>
                    <td>
                      108
                      <br />
                      1308
                    </td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>Second Floor</td>
                    <td>
                      201
                      <br />
                      1321
                    </td>
                    <td>
                      202
                      <br />
                      1117
                    </td>
                    <td>
                      203
                      <br />
                      1308
                    </td>
                    <td>
                      204
                      <br />
                      1372
                    </td>
                    <td>
                      205
                      <br />
                      1372
                    </td>
                    <td>
                      206
                      <br />
                      1166
                    </td>
                    <td>
                      207
                      <br />
                      1356
                    </td>
                    <td>
                      208
                      <br />
                      1308
                    </td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td>Third Floor</td>
                    <td>
                      301
                      <br />
                      1321
                    </td>
                    <td>
                      302
                      <br />
                      1117
                    </td>
                    <td>
                      303
                      <br />
                      1308
                    </td>
                    <td>
                      304
                      <br />
                      1372
                    </td>
                    <td>
                      305
                      <br />
                      1372
                    </td>
                    <td>
                      306
                      <br />
                      1166
                    </td>
                    <td>
                      307
                      <br />
                      1356
                    </td>
                    <td>
                      308
                      <br />
                      1308
                    </td>
                  </tr>
                  <tr>
                    <td>5.</td>
                    <td>Fourth Floor</td>
                    <td>
                      401
                      <br />
                      1321
                    </td>
                    <td>
                      402
                      <br />
                      1117
                    </td>
                    <td>
                      403
                      <br />
                      1308
                    </td>
                    <td>
                      404
                      <br />
                      1372
                    </td>
                    <td>
                      405
                      <br />
                      1372
                    </td>
                    <td>
                      406
                      <br />
                      1166
                    </td>
                    <td>
                      407
                      <br />
                      1356
                    </td>
                    <td>
                      408
                      <br />
                      1308
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projectData[projectId] || projectData["jsn-signature"];
  const { toggleSaveProperty, isPropertySaved } = useSavedProperties();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we're on JSN Sunshine page
    if (projectId === "jsn-sunshine") {
      console.log("JSN Sunshine Project Page loaded");
    }

    // Check if property is already saved
    setIsSaved(isPropertySaved(project.id));
  }, [projectId, project.id, isPropertySaved]);

  // Log tab changes
  useEffect(() => {
    console.log("Active Tab Changed:", activeTab);
    console.log("Current Project ID:", projectId);
  }, [activeTab, projectId]);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setActiveIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length
    );
  };

  const handleBookSlot = () => {
    // Navigate to slot booking page with the project name as state
    navigate("/slot-booking", {
      state: {
        apartment: projectData[projectId].name,
      },
    });
  };

  // Handle toggling save property
  const handleSaveProperty = () => {
    // Create property object to save
    const propertyToSave = {
      id: project.id,
      name: project.name,
      type: project.pricing.units[0].type + " Apartment",
      price: project.pricing.units[0].price,
      location: project.location.address,
      image: project.images[0],
    };

    console.log("Saving property:", propertyToSave);

    // Toggle save the property
    const result = toggleSaveProperty(propertyToSave);
    console.log("Save result:", result);
    setSaveMessage(result.message);
    setIsSaved(result.saved);

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  return (
    <div className="project-details-page">
      {/* Visual elements */}
      <div className="detail-visual detail-visual-1"></div>
      <div className="detail-visual detail-visual-2"></div>
      <div className="detail-visual detail-visual-3"></div>
      <div className="detail-glow detail-glow-1"></div>
      <div className="detail-glow detail-glow-2"></div>

      <div className="project-details-content">
        <div className="project-details-main">
          <div className="project-image-gallery">
            <div className="main-image-container">
              <img
                src={project.images[activeIndex]}
                alt={`${project.name}`}
                className="main-project-image active"
              />
              <div className="project-badges">
                {project.features.map((feature, index) => (
                  <div key={index} className="project-badge">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="floor-plan-carousel">
              <button
                className="carousel-arrow prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <div className="carousel-container">
                {project.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className={`floor-plan ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
              <button
                className="carousel-arrow next"
                onClick={nextImage}
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>

            <div className="project-actions">
              <a href="tel:+917975939422" className="action-button call-button">
                Call for Details
              </a>
              <button
                className="action-button book-slot-btn"
                onClick={handleBookSlot}
              >
                Book a Site Visit
              </button>
            </div>

            <div className="emi-calculator-container in-gallery">
              <EMICalculator />
            </div>
          </div>

          <div className="project-info-container">
            <div className="project-header">
              <div className="project-title">
                <h1 className="project-name">{project.name}</h1>
                <p className="project-tagline">{project.tagline}</p>
              </div>
              <button
                className={`save-property-btn ${isSaved ? "saved" : ""}`}
                onClick={handleSaveProperty}
                title={
                  isSaved
                    ? "Remove from saved properties"
                    : "Save this property"
                }
              >
                {isSaved ? "❤️ Saved" : "🤍 Save"}
              </button>
              {saveMessage && <div className="save-message">{saveMessage}</div>}
            </div>

            <div className="project-pricing full-width">
              <h2>Starting from</h2>
              <p className="price">₹ {project.startingPrice}</p>
              <p className="price-per-sqft">{project.pricePerSqFt}</p>
              <PriceBreakdown projectData={project} />
            </div>

            <div className="project-tabs">
              <div
                className={`project-tab ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </div>
              <div
                className={`project-tab ${
                  activeTab === "specifications" ? "active" : ""
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </div>
              <div
                className={`project-tab ${
                  activeTab === "amenities" ? "active" : ""
                }`}
                onClick={() => setActiveTab("amenities")}
              >
                Amenities
              </div>
              <div
                className={`project-tab ${
                  activeTab === "area" ? "active" : ""
                }`}
                onClick={() => setActiveTab("area")}
              >
                Area Statement
              </div>
              <div
                className={`project-tab ${
                  activeTab === "location" ? "active" : ""
                }`}
                onClick={() => setActiveTab("location")}
              >
                Location
              </div>
            </div>

            {activeTab === "description" && (
              <div className="project-description">
                <h2>Description of project</h2>
                <div className="description-content">
                  <p>{project.description}</p>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="project-specifications">
                <h2>SPECIFICATIONS</h2>
                <div className="detailed-specs-grid">
                  <div className="spec-item">
                    <div className="spec-icon">🏢</div>
                    <div className="spec-content">
                      <h3>STRUCTURE</h3>
                      <p>RCC framed structure</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🧱</div>
                    <div className="spec-content">
                      <h3>WALLS</h3>
                      <p>
                        6" thick cement concrete solid block for exterior walls
                        & 4" thick cement concrete solid block for interior
                        walls
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🪟</div>
                    <div className="spec-content">
                      <h3>WINDOWS</h3>
                      <p>
                        UPVC windows with glass sliding shutters with
                        mosquitomesh and MS safety grills
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🚽</div>
                    <div className="spec-content">
                      <h3>TOILETS</h3>
                      <p>
                        Anti-skid ceramic tiled flooring & glaze tile dado upto
                        7' height
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🏢</div>
                    <div className="spec-content">
                      <h3>FLOORING</h3>
                      <p>
                        Vitrified tiles for entire flat and ceramic tiled
                        flooring for utility
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🍳</div>
                    <div className="spec-content">
                      <h3>KITCHEN</h3>
                      <p>
                        Granite platform with steel sink 2' height ceramic tiled
                        dado on cooking platform.
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🚿</div>
                    <div className="spec-content">
                      <h3>SANTIRY</h3>
                      <p>Good quality cp fittings and sanitary ware</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🚪</div>
                    <div className="spec-content">
                      <h3>DOORS</h3>
                      <p>
                        Main door with teak wood frame with moulded panel
                        shutter and for internal doors salwood frame with
                        moulded panel shutters.
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">⚡</div>
                    <div className="spec-content">
                      <h3>ELECTRICAL</h3>
                      <p>
                        Concealed copper wiring with good quality switches, AC
                        point for master bedroom, aqua guard & washing machine
                        points.
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🎨</div>
                    <div className="spec-content">
                      <h3>PAINTING</h3>
                      <p>
                        Asian/Alek/ Berger/sherwin williams paint for
                        interiors,water proof emulsion paint for exterior.
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">📞</div>
                    <div className="spec-content">
                      <h3>INTERCOM</h3>
                      <p>
                        Intercom facility for all flats, connecting to security.
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">📺</div>
                    <div className="spec-content">
                      <h3>TV & TELEPHONE</h3>
                      <p>TV & Telephone point in Living & master bedroom</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🔋</div>
                    <div className="spec-content">
                      <h3>POWER BACKUP</h3>
                      <p>
                        Generator for common area lighting lift. 0.6 KVA power
                        back for each flat
                      </p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🛗</div>
                    <div className="spec-content">
                      <h3>LIFT</h3>
                      <p>Lift of KONE / Johnson/ OTIS or equivalent</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">🚗</div>
                    <div className="spec-content">
                      <h3>CAR PARKING</h3>
                      <p>Exclusive covered car parking</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-icon">💧</div>
                    <div className="spec-content">
                      <h3>WATER SUPPLY</h3>
                      <p>Water supply from Borwell</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="project-amenities">
                <h2>Premium Amenities</h2>
                <div className="amenities-grid">
                  {project.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <div className="amenity-icon">{amenity.icon}</div>
                      <div className="amenity-name">{amenity.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "area" && <AreaStatement projectId={projectId} />}

            {activeTab === "location" && (
              <div className="project-location">
                <h2>Prime Location</h2>
                <div className="location-address">
                  <div className="location-icon">📍</div>
                  <div className="location-text">
                    {project.location.address}
                  </div>
                </div>
                <h3>Nearby Places</h3>
                <div className="nearby-places">
                  {project.location.nearbyPlaces.map((place, index) => (
                    <div key={index} className="nearby-place">
                      <div className="place-type">
                        {place.type === "school" && "🏫"}
                        {place.type === "hospital" && "🏥"}
                        {place.type === "mall" && "🛍️"}
                        {place.type === "it_park" && "🏢"}
                        {place.type === "airport" && "✈️"}
                      </div>
                      <div className="place-details">
                        <div className="place-name">{place.name}</div>
                        <div className="place-distance">{place.distance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
