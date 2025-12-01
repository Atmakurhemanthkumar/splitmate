import React from 'react';
import './StarBorderButton.css';

const StarBorderButton = ({ children, onClick }) => (
  <button className="star-border-btn" onClick={onClick}>
    {children}
    <span className="stars"></span>
  </button>
);

export default StarBorderButton;
