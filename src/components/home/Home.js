import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import HeroSection from './HeroSection';
import HighlightsSection from './HighlightsSection';
import Projects from '../projects/Projects';
import Footer from '../layout/Footer';

const Home = () => {
  const location = useLocation();
  const projectsRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    // Check if the URL has a hash, and scroll to the appropriate section
    if (location.hash === '#projects' && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#contact') {
      // Small timeout to ensure the component is fully mounted
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else if (!location.hash || location.hash === '#top') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="home" id="top" ref={topRef}>
      <HeroSection />
      <HighlightsSection />
      <div id="projects" ref={projectsRef}>
        <Projects />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
