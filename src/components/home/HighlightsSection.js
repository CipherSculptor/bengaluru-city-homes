import React, { useState, useEffect } from 'react';
import './HighlightsSection.css';

const HighlightsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const highlights = [
    'Experience open and airy living spaces designed for relaxation and entertaining.',
    'Elegant flooring and stylish finishes create a sophisticated ambiance.',
    'Contemporary kitchens with premium countertops and appliances.',
    'A convenient address that puts you close to everything.'
  ];

  const propertyImages = [
    '/images/Screenshot 2025-04-04 at 20.31.32.png',
    '/images/Screenshot 2025-04-04 at 20.31.45.png',
    '/images/Screenshot 2025-04-04 at 20.32.08.png',
    '/images/Screenshot 2025-04-04 at 20.32.17.png'
  ];

  const changeImage = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction);
    
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % propertyImages.length);
    }
  };

  // Auto slideshow when not hovered
  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        changeImage('right');
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHovered, isAnimating]);

  // Reset animation flag after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 700); // Match this to your animation duration
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="highlights-section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="highlights-card">
              <h2>HighLights</h2>
              <ul className="highlights-list">
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="property-images-container">
              <button 
                className="nav-button prev" 
                onClick={() => changeImage('left')}
                aria-label="Previous image"
              >
                ‹
              </button>
              <div 
                className="property-images-scroll"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img 
                  key={`image-${currentIndex}`}
                  src={propertyImages[currentIndex]} 
                  alt={`Property ${currentIndex + 1}`} 
                  className={`property-image slide-${slideDirection}${isHovered ? ' zoom-effect' : ''}`}
                />
                {isHovered && (
                  <div className="image-info">
                    <span>Property {currentIndex + 1}</span>
                    <div className="view-details-btn">View Details</div>
                  </div>
                )}
              </div>
              <button 
                className="nav-button next" 
                onClick={() => changeImage('right')}
                aria-label="Next image"
              >
                ›
              </button>
              
              {/* Dots indicator */}
              <div className="dots-indicator">
                {propertyImages.map((_, index) => (
                  <span 
                    key={index} 
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (index > currentIndex) {
                        setSlideDirection('right');
                      } else if (index < currentIndex) {
                        setSlideDirection('left');
                      }
                      setCurrentIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightsSection;
