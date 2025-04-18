import React from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';
import projectImage1 from '../../assets/projectssection_images/projectsection_1.png';
import projectImage2 from '../../assets/projectssection_images/projectsection_2.png';
import projectImage3 from '../../assets/slv_enclave/Main.png';

const Projects = () => {
  const projects = [
    {
      id: 1,
      image: projectImage1,
      title: 'JSN SIGNATURE,',
      location: 'HORAMAVU BENGALURU',
      slug: 'jsn-signature'
    },
    {
      id: 2,
      image: projectImage2,
      title: 'JSN SUNSHINE, HORAMAVU',
      location: 'BENGALURU',
      slug: 'jsn-sunshine'
    },
    {
      id: 3,
      image: projectImage3,
      title: 'SLV ENCLAVE, KODIGEHALLI',
      location: 'KR PURAM BENGALURU',
      slug: 'slv-enclave'
    }
  ];

  return (
    <div className="projects">
      {/* Background Bubbles */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>
      <div className="bubble bubble-6"></div>
      
      {/* Floating Particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      
      {/* Glowing Bubbles */}
      <div className="glow-bubble glow-bubble-1"></div>
      <div className="glow-bubble glow-bubble-2"></div>
      <div className="glow-bubble glow-bubble-3"></div>
      
      {/* Shimmer Effects */}
      <div className="shimmer shimmer-1"></div>
      <div className="shimmer shimmer-2"></div>
      <div className="shimmer shimmer-3"></div>
      
      {/* Bottom Wave */}
      <div className="wave"></div>
      
      <div className="projects-container">
        <h1 className="projects-title">Our Projects</h1>
        <p className="projects-subtitle">Discover our premium residential properties in Bengaluru</p>
        
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image-container">
                <img src={project.image} alt={project.title} className="project-image" />
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-location">{project.location}</p>
                <Link to={`/project/${project.slug}`} className="view-details-btn">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects; 