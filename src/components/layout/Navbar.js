import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Only track sections when on home page
      if (location.pathname === "/") {
        // Determine which section is currently in view
        const projectsSection = document.getElementById("projects");
        const heroSection = document.querySelector(".hero-section");
        const highlightsSection = document.querySelector(".highlights-section");

        const scrollPosition = window.scrollY + window.innerHeight / 3;

        if (projectsSection && scrollPosition >= projectsSection.offsetTop) {
          setActiveSection("projects");
        } else if (
          highlightsSection &&
          scrollPosition >= highlightsSection.offsetTop
        ) {
          setActiveSection("highlights");
        } else if (heroSection) {
          setActiveSection("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Update active section when location changes (e.g., when a link is clicked)
  useEffect(() => {
    if (location.pathname === "/") {
      if (location.hash === "#projects") {
        setActiveSection("projects");
      } else {
        setActiveSection("home");
      }
    }
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      // If not on home page, navigate to home first
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for navbar height
        behavior: "smooth",
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img
              src={Logo}
              alt="Bengaluru City Homes Logo"
              className="logo-image"
            />
          </Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
          <div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
          <div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${
              activeSection === "home" && location.pathname === "/"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setMenuOpen(false);
              if (location.pathname === "/") {
                scrollToSection("top");
              }
            }}
          >
            <span className="nav-link-text">Home</span>
          </Link>

          <Link
            to="/#projects"
            className={`nav-link ${
              activeSection === "projects" && location.pathname === "/"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                scrollToSection("projects");
              }
              setMenuOpen(false);
            }}
          >
            <span className="nav-link-text">Projects</span>
          </Link>

          <NavLink
            to="/slot-booking"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-link-text">Slot Booking</span>
          </NavLink>

          <NavLink
            to="/location"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-link-text">Location</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-link-text">Profile</span>
          </NavLink>

          <div className="contact-btn">
            <Link
              to="/#contact"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === "/") {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                } else {
                  // If not on home page, navigate to home page with contact hash
                  window.location.href = "/#contact";
                }
                setMenuOpen(false);
              }}
            >
              Contact Us
            </Link>
          </div>

          {currentUser && (
            <div className="logout-btn">
              <button
                onClick={async () => {
                  await logout();
                  // Force a redirect to login page
                  navigate("/login", { replace: true });
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
