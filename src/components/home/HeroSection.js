import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import HomeImageFamily from '../../assets/HomeImage_family.png';
import property_home from '../../assets/property_home.png';
import svprime_home from '../../assets/svprime_home.png';
import slv_enclave from '../../assets/slv_enclave.png';

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const images = [
    HomeImageFamily,
    property_home,
    svprime_home,
    slv_enclave
  ];

  const changeImage = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'left') {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentImage]);

  // Different styling for different image types
  const getBackgroundStyle = () => {
    // For the family image (first image)
    if (currentImage === 0) {
      return {
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      };
    } 
    // For property images
    else {
      return {
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'contain', // Use contain instead of cover for property images
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0c3b69' // Changed to match the navbar blue color
      };
    }
  };

  return (
    <div 
      className="hero-section" 
      style={getBackgroundStyle()}
    >
      <div className="hero-content">
        {currentImage === 0 && (
          <div className="hero-text">
            <h2>Find Your Dream Home.</h2>
            <h2>Start Your Next Chapter.</h2>
          </div>
        )}
        <div className="hero-navigation">
          <button 
            className="nav-arrow" 
            onClick={() => changeImage('left')}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button 
            className="nav-arrow" 
            onClick={() => changeImage('right')}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
        
        {/* Image pagination dots */}
        <div className="image-pagination">
          {images.map((_, index) => (
            <div 
              key={index}
              className={`pagination-dot ${currentImage === index ? 'active' : ''}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentImage(index);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
