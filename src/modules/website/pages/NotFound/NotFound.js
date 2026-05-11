import React from "react";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="error-code" style={{ fontSize: '100px', fontWeight: 'bold', color: '#ccc', margin: 0 }}>404</h1>
      <h1 className="error-title">Oops! Page Not Found</h1>
      <p className="error-message">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
}

export default NotFound;
