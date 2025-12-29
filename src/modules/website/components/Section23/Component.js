import React from 'react';
import './component.css';

const GoogleMapsEmbed = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.7307144133397!2d77.3105427749085!3d28.397200294729597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdd2e7679ce6b%3A0x36927f402b606532!2s%26work%20Co-working!5e0!3m2!1sen!2sin!4v1705057161175!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsEmbed;
