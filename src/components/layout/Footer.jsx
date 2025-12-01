import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About SplitMate</h3>
          <p>
            Making expense splitting simple and transparent. 
            Track, split, and settle bills with friends effortlessly.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <a href="#about">About Us</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <div className="footer-links">
            <a href="#help">Help Center</a>
            <a href="#blog">Blog</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 XXXXXXXXXX@gmail.com</p>
          <p>📞 +91 91XXXXXXXX</p>
          <p>📍 Hyderabad, IBP, RR DIST</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 SplitMate. All rights reserved. | Built with ❤️ for smarter expense management</p>
      </div>
    </footer>
  );
};

export default Footer;