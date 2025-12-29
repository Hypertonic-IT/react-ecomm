import React from "react";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <img
        src="img/about-hyper.png"
        alt="404 Not Found"
        className="not-found-image"
      />
      <h1 className="error-title">Oops! Page Not Found</h1>
      <p className="error-message">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
}

export default NotFound;
