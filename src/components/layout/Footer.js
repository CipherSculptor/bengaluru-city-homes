import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      feedback: ''
    });
    // Show success message or notification
    alert('Feedback submitted successfully! Thank you for your valuable input.');
  };

  return (
    <footer className="footer">
      {/* Background particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      
      <div className="footer-content">
        <div className="footer-sections">
          <div className="contact-section" id="contact">
            <h2 className="section-title">CONTACT US</h2>
            <div className="contact-info">
              <div className="contact-item">
                <i className="contact-icon location-icon"></i>
                <p>Horamavu, Bengaluru, Karnataka 560025</p>
              </div>
              <div className="contact-item">
                <i className="contact-icon phone-icon"></i>
                <p>+91 7975939422</p>
              </div>
              <div className="contact-item">
                <i className="contact-icon email-icon"></i>
                <p>info@bengalurucityhomes.com</p>
              </div>
              <div className="contact-item">
                <i className="contact-icon time-icon"></i>
                <p>Mon-Sun: 9AM - 6PM</p>
              </div>
              <div className="social-links">
                <a href="#" className="social-icon facebook-icon" aria-label="Facebook"></a>
                <a href="#" className="social-icon twitter-icon" aria-label="Twitter"></a>
                <a href="#" className="social-icon instagram-icon" aria-label="Instagram"></a>
                <a href="#" className="social-icon linkedin-icon" aria-label="LinkedIn"></a>
              </div>
            </div>
          </div>
          <div className="feedback-form-container">
            <h2 className="feedback-title">FEEDBACK FORM</h2>
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Share your feedback with us..."
                  required
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="submit-btn">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>Copyrights © Made by P Pavan Kumar with <span className="heart">❤️</span></p>
      </div>
    </footer>
  );
};

export default Footer; 