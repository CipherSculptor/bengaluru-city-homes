import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Location.css";

// Import project images
import jsnSignatureImage from "../../assets/JSN_signature_Images/MainImage.png";
import jsnSunshineImage from "../../assets/JSN_sunshine_images/main.png";
import slvEnclaveImage from "../../assets/slv_enclave/Main.png";

const Location = () => {
  const [activeLocation, setActiveLocation] = useState("all");
  const [animateIn, setAnimateIn] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Location data for each property
  const locationData = {
    "jsn-signature": {
      name: "JSN Signature",
      area: "Horamavu",
      image: jsnSignatureImage,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0679797211555!2d77.6546!3d13.0234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17b5c3b7e5a7%3A0x9e3c5c5c5c5c5c5c!2sHoramavu%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1617000000000!5m2!1sen!2sin",
      connectivity: {
        airport: { distance: "25 km", time: "45 mins" },
        railway: { distance: "12 km", time: "25 mins" },
        metro: { distance: "8 km", time: "15 mins" },
        bus: { distance: "0.5 km", time: "5 mins" },
      },
      nearbyPlaces: [
        {
          type: "education",
          name: "Orchids International School",
          distance: "0.5 km",
        },
        { type: "education", name: "Delhi Public School", distance: "3 km" },
        {
          type: "healthcare",
          name: "Bangalore Baptist Hospital",
          distance: "3 km",
        },
        {
          type: "healthcare",
          name: "Columbia Asia Hospital",
          distance: "5 km",
        },
        { type: "shopping", name: "Phoenix Marketcity", distance: "7 km" },
        { type: "shopping", name: "Orion Mall", distance: "9 km" },
        { type: "tech-park", name: "Manyata Tech Park", distance: "6 km" },
        { type: "tech-park", name: "Bagmane Tech Park", distance: "10 km" },
      ],
      neighborhoodHighlights: [
        "Rapidly developing residential area",
        "Excellent connectivity to IT hubs",
        "Good educational institutions nearby",
        "Upcoming metro connectivity",
        "Serene environment away from city congestion",
      ],
      futureDevelopments: [
        "Proposed metro station within 2 km",
        "Upcoming shopping mall within 3 km",
        "Road widening project in progress",
        "New international school coming up",
        "IT corridor expansion nearby",
      ],
      livabilityScore: 8.5,
      livabilityFactors: {
        connectivity: 8,
        infrastructure: 7.5,
        amenities: 8,
        greenery: 9,
        safety: 8.5,
      },
    },
    "jsn-sunshine": {
      name: "JSN Sunshine",
      area: "Horamavu",
      image: jsnSunshineImage,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0679797211555!2d77.6546!3d13.0234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17b5c3b7e5a7%3A0x9e3c5c5c5c5c5c5c!2sHoramavu%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1617000000000!5m2!1sen!2sin",
      connectivity: {
        airport: { distance: "25 km", time: "45 mins" },
        railway: { distance: "12 km", time: "25 mins" },
        metro: { distance: "8 km", time: "15 mins" },
        bus: { distance: "0.5 km", time: "5 mins" },
      },
      nearbyPlaces: [
        {
          type: "education",
          name: "Orchids International School",
          distance: "0.5 km",
        },
        { type: "education", name: "Delhi Public School", distance: "3 km" },
        {
          type: "healthcare",
          name: "Bangalore Baptist Hospital",
          distance: "3 km",
        },
        {
          type: "healthcare",
          name: "Columbia Asia Hospital",
          distance: "5 km",
        },
        { type: "shopping", name: "Phoenix Marketcity", distance: "7 km" },
        { type: "shopping", name: "Orion Mall", distance: "9 km" },
        { type: "tech-park", name: "Manyata Tech Park", distance: "6 km" },
        { type: "tech-park", name: "Bagmane Tech Park", distance: "10 km" },
      ],
      neighborhoodHighlights: [
        "Rapidly developing residential area",
        "Excellent connectivity to IT hubs",
        "Good educational institutions nearby",
        "Upcoming metro connectivity",
        "Serene environment away from city congestion",
      ],
      futureDevelopments: [
        "Proposed metro station within 2 km",
        "Upcoming shopping mall within 3 km",
        "Road widening project in progress",
        "New international school coming up",
        "IT corridor expansion nearby",
      ],
      livabilityScore: 8.5,
      livabilityFactors: {
        connectivity: 8,
        infrastructure: 7.5,
        amenities: 8,
        greenery: 9,
        safety: 8.5,
      },
    },
    "slv-enclave": {
      name: "SLV Enclave",
      area: "Kodigehalli, KR Puram",
      image: slvEnclaveImage,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.4279797211555!2d77.7046!3d13.0034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17b5c3b7e5a7%3A0x9e3c5c5c5c5c5c5c!2sKR%20Puram%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1617000000000!5m2!1sen!2sin",
      connectivity: {
        airport: { distance: "30 km", time: "55 mins" },
        railway: { distance: "3 km", time: "10 mins" },
        metro: { distance: "5 km", time: "12 mins" },
        bus: { distance: "0.2 km", time: "3 mins" },
      },
      nearbyPlaces: [
        { type: "education", name: "New Horizon College", distance: "2 km" },
        {
          type: "education",
          name: "Ryan International School",
          distance: "4 km",
        },
        { type: "healthcare", name: "Cloud Nine Hospital", distance: "3.5 km" },
        { type: "healthcare", name: "Manipal Hospital", distance: "6 km" },
        { type: "shopping", name: "Varthur Central Mall", distance: "4 km" },
        { type: "shopping", name: "Forum Shantiniketan", distance: "8 km" },
        { type: "tech-park", name: "ITPL", distance: "7 km" },
        { type: "tech-park", name: "Prestige Tech Park", distance: "9 km" },
      ],
      neighborhoodHighlights: [
        "Established residential neighborhood",
        "Excellent connectivity to major IT parks",
        "Well-developed social infrastructure",
        "Metro station nearby",
        "Multiple shopping options within reach",
      ],
      futureDevelopments: [
        "New flyover construction to ease traffic",
        "Smart city initiatives in the area",
        "Upcoming hospital within 2 km",
        "New tech park development nearby",
        "Lake rejuvenation project",
      ],
      livabilityScore: 8.7,
      livabilityFactors: {
        connectivity: 9,
        infrastructure: 8,
        amenities: 8.5,
        greenery: 8,
        safety: 9,
      },
    },
  };

  // Testimonials from residents
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      property: "JSN Signature",
      quote:
        "Living in Horamavu has been a great experience. The area is developing rapidly, and we have all the amenities we need within a short distance.",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Rahul Verma",
      property: "JSN Sunshine",
      quote:
        "The connectivity to my workplace in Manyata Tech Park is excellent. The neighborhood is peaceful yet has everything we need for daily life.",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Ananya Desai",
      property: "SLV Enclave",
      quote:
        "KR Puram is perfectly located for families. We have great schools, hospitals, and shopping options nearby. The metro connectivity is a huge plus!",
      rating: 4.8,
    },
  ];

  useEffect(() => {
    // Start the entrance animation
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    // Show map after a delay for better performance
    setTimeout(() => {
      setShowMap(true);
    }, 500);
  }, []);

  const handleLocationChange = (location) => {
    setAnimateIn(false);
    setTimeout(() => {
      setActiveLocation(location);
      setAnimateIn(true);
    }, 300);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star full">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  // Function to render livability score gauge
  const renderLivabilityGauge = (score) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="livability-gauge">
        <div className="gauge-background">
          <div className="gauge-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="gauge-value">{score}/10</div>
      </div>
    );
  };

  // Function to render livability factors
  const renderLivabilityFactors = (factors) => {
    return Object.entries(factors).map(([factor, score]) => (
      <div key={factor} className="livability-factor">
        <div className="factor-name">
          {factor.charAt(0).toUpperCase() + factor.slice(1)}
        </div>
        <div className="factor-gauge">
          <div
            className="factor-fill"
            style={{ width: `${(score / 10) * 100}%` }}
          ></div>
        </div>
        <div className="factor-score">{score}</div>
      </div>
    ));
  };

  return (
    <div className="location-page">
      {/* Floating elements for visual interest */}
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
      <div className="floating-element element-4"></div>
      <div className="floating-element element-5"></div>

      <div className="location-container">
        <div className="location-header">
          <h1>PRIME LOCATIONS IN BENGALURU</h1>
          <p className="location-subtitle">
            Discover the perfect neighborhood for your dream home
          </p>
        </div>

        <div className="location-tabs">
          <button
            className={`location-tab ${
              activeLocation === "all" ? "active" : ""
            }`}
            onClick={() => handleLocationChange("all")}
          >
            All Locations
          </button>
          {Object.keys(locationData).map((key) => (
            <button
              key={key}
              className={`location-tab ${
                activeLocation === key ? "active" : ""
              }`}
              onClick={() => handleLocationChange(key)}
            >
              {locationData[key].name}
            </button>
          ))}
        </div>

        <div
          className={`location-content ${
            animateIn ? "animate-in" : "animate-out"
          }`}
        >
          {/* Map Section */}
          <div className="map-section">
            <h2>Interactive Map</h2>
            <div className="map-container">
              {showMap &&
                (activeLocation === "all" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1617000000000!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Bengaluru Map"
                  ></iframe>
                ) : (
                  <iframe
                    src={locationData[activeLocation]?.mapUrl}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title={`${locationData[activeLocation]?.name} Map`}
                  ></iframe>
                ))}
            </div>
          </div>

          {/* Property Locations */}
          {activeLocation === "all" && (
            <div className="property-locations">
              <h2>Our Property Locations</h2>
              <div className="location-cards">
                {Object.keys(locationData).map((key) => (
                  <div key={key} className="location-card">
                    <div className="location-image">
                      <img
                        src={locationData[key].image}
                        alt={locationData[key].name}
                      />
                    </div>
                    <div className="location-info">
                      <h3>{locationData[key].name}</h3>
                      <p className="location-area">{locationData[key].area}</p>
                      <div className="location-highlights">
                        <div className="highlight">
                          <span className="highlight-icon">✈️</span>
                          <span className="highlight-text">
                            Airport:{" "}
                            {locationData[key].connectivity.airport.distance}
                          </span>
                        </div>
                        <div className="highlight">
                          <span className="highlight-icon">🏢</span>
                          <span className="highlight-text">
                            Tech Parks:{" "}
                            {
                              locationData[key].nearbyPlaces.filter(
                                (p) => p.type === "tech-park"
                              ).length
                            }{" "}
                            nearby
                          </span>
                        </div>
                        <div className="highlight">
                          <span className="highlight-icon">🏫</span>
                          <span className="highlight-text">
                            Schools:{" "}
                            {
                              locationData[key].nearbyPlaces.filter(
                                (p) => p.type === "education"
                              ).length
                            }{" "}
                            nearby
                          </span>
                        </div>
                      </div>
                      <div className="livability-score">
                        <span className="score-label">Livability Score:</span>
                        <span className="score-value">
                          {locationData[key].livabilityScore}/10
                        </span>
                      </div>
                      <button
                        className="view-details-btn"
                        onClick={() => handleLocationChange(key)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specific Location Details */}
          {activeLocation !== "all" && (
            <div className="location-details">
              <div className="location-overview">
                <div className="overview-image">
                  <img
                    src={locationData[activeLocation].image}
                    alt={locationData[activeLocation].name}
                  />
                </div>
                <div className="overview-content">
                  <h2>
                    {locationData[activeLocation].name} -{" "}
                    {locationData[activeLocation].area}
                  </h2>
                  <div className="livability-overview">
                    <h3>Livability Score</h3>
                    {renderLivabilityGauge(
                      locationData[activeLocation].livabilityScore
                    )}
                    <div className="livability-factors">
                      {renderLivabilityFactors(
                        locationData[activeLocation].livabilityFactors
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="location-sections">
                <div className="location-section connectivity-section">
                  <h3>Connectivity</h3>
                  <div className="connectivity-grid">
                    <div className="connectivity-item">
                      <div className="connectivity-icon">✈️</div>
                      <div className="connectivity-details">
                        <div className="connectivity-type">Airport</div>
                        <div className="connectivity-distance">
                          {
                            locationData[activeLocation].connectivity.airport
                              .distance
                          }
                        </div>
                        <div className="connectivity-time">
                          {
                            locationData[activeLocation].connectivity.airport
                              .time
                          }{" "}
                          drive
                        </div>
                      </div>
                    </div>
                    <div className="connectivity-item">
                      <div className="connectivity-icon">🚆</div>
                      <div className="connectivity-details">
                        <div className="connectivity-type">Railway Station</div>
                        <div className="connectivity-distance">
                          {
                            locationData[activeLocation].connectivity.railway
                              .distance
                          }
                        </div>
                        <div className="connectivity-time">
                          {
                            locationData[activeLocation].connectivity.railway
                              .time
                          }{" "}
                          drive
                        </div>
                      </div>
                    </div>
                    <div className="connectivity-item">
                      <div className="connectivity-icon">🚇</div>
                      <div className="connectivity-details">
                        <div className="connectivity-type">Metro Station</div>
                        <div className="connectivity-distance">
                          {
                            locationData[activeLocation].connectivity.metro
                              .distance
                          }
                        </div>
                        <div className="connectivity-time">
                          {locationData[activeLocation].connectivity.metro.time}{" "}
                          drive
                        </div>
                      </div>
                    </div>
                    <div className="connectivity-item">
                      <div className="connectivity-icon">🚌</div>
                      <div className="connectivity-details">
                        <div className="connectivity-type">Bus Stop</div>
                        <div className="connectivity-distance">
                          {
                            locationData[activeLocation].connectivity.bus
                              .distance
                          }
                        </div>
                        <div className="connectivity-time">
                          {locationData[activeLocation].connectivity.bus.time}{" "}
                          walk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="location-section nearby-section">
                  <h3>Nearby Places</h3>
                  <div className="nearby-categories">
                    <div className="nearby-category">
                      <h4>Education</h4>
                      <div className="nearby-places">
                        {locationData[activeLocation].nearbyPlaces
                          .filter((place) => place.type === "education")
                          .map((place, index) => (
                            <div key={index} className="nearby-place">
                              <div className="place-icon">🏫</div>
                              <div className="place-details">
                                <div className="place-name">{place.name}</div>
                                <div className="place-distance">
                                  {place.distance}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="nearby-category">
                      <h4>Healthcare</h4>
                      <div className="nearby-places">
                        {locationData[activeLocation].nearbyPlaces
                          .filter((place) => place.type === "healthcare")
                          .map((place, index) => (
                            <div key={index} className="nearby-place">
                              <div className="place-icon">🏥</div>
                              <div className="place-details">
                                <div className="place-name">{place.name}</div>
                                <div className="place-distance">
                                  {place.distance}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="nearby-category">
                      <h4>Shopping</h4>
                      <div className="nearby-places">
                        {locationData[activeLocation].nearbyPlaces
                          .filter((place) => place.type === "shopping")
                          .map((place, index) => (
                            <div key={index} className="nearby-place">
                              <div className="place-icon">🛍️</div>
                              <div className="place-details">
                                <div className="place-name">{place.name}</div>
                                <div className="place-distance">
                                  {place.distance}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="nearby-category">
                      <h4>Tech Parks</h4>
                      <div className="nearby-places">
                        {locationData[activeLocation].nearbyPlaces
                          .filter((place) => place.type === "tech-park")
                          .map((place, index) => (
                            <div key={index} className="nearby-place">
                              <div className="place-icon">🏢</div>
                              <div className="place-details">
                                <div className="place-name">{place.name}</div>
                                <div className="place-distance">
                                  {place.distance}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="location-section highlights-section">
                  <h3>Neighborhood Highlights</h3>
                  <div className="highlights-list">
                    {locationData[activeLocation].neighborhoodHighlights.map(
                      (highlight, index) => (
                        <div key={index} className="highlight-item">
                          <div className="highlight-icon">✓</div>
                          <div className="highlight-text">{highlight}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="location-section future-section">
                  <h3>Future Developments</h3>
                  <div className="future-developments">
                    {locationData[activeLocation].futureDevelopments.map(
                      (development, index) => (
                        <div key={index} className="future-item">
                          <div className="future-icon">🔜</div>
                          <div className="future-text">{development}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="location-cta">
                <h3>Interested in {locationData[activeLocation].name}?</h3>
                <div className="cta-buttons">
                  <Link
                    to={`/project/${activeLocation}`}
                    className="cta-button view-property"
                  >
                    View Property Details
                  </Link>
                  <Link
                    to="/slot-booking"
                    state={{ apartment: locationData[activeLocation].name }}
                    className="cta-button book-visit"
                  >
                    Book a Site Visit
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Section */}
          <div className="testimonials-section">
            <h2>What Residents Say</h2>
            <div className="testimonials-container">
              {testimonials
                .filter(
                  (testimonial) =>
                    activeLocation === "all" ||
                    testimonial.property === locationData[activeLocation]?.name
                )
                .map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-quote">
                      "{testimonial.quote}"
                    </div>
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="author-details">
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-property">
                          Resident at {testimonial.property}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
