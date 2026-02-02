import React from 'react';
import './DeveloperCredit.css';

const DeveloperCredit = () => {
  return (
    <a 
      href="https://github.com/Tharunkunamalla" 
      target="_blank" 
      rel="noopener noreferrer"
      className="developer-credit"
    >
      <div className="avatar-container">
        <img 
          src="https://github.com/Tharunkunamalla.png" 
          alt="Tharun Kunamalla" 
          className="developer-avatar"
        />
        <div className="heartbeat-dot"></div>
      </div>
      <div className="developer-info">
        <span className="developed-by">Developed by</span>
        <span className="developer-name">Tharun Kunamalla</span>
      </div>
    </a>
  );
};

export default DeveloperCredit;
