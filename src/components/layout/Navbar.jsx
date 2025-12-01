import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        SplitMate
      </div>
      <ul className="nav-links">
        <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
        <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
        <li><a href="#services-contact" onClick={(e) => { e.preventDefault(); scrollToSection('services-contact'); }}>Services</a></li>
        <li><a href="#services-contact" onClick={(e) => { e.preventDefault(); scrollToSection('services-contact'); }}>Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;