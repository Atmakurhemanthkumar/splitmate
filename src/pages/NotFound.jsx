import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh' }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: '#ffd700' }}>Go back home</Link>
    </div>
  );
};

export default NotFound;