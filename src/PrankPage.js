import React from 'react';
import './PrankPage.css';

function PrankPage() {
  return (
    <div className="prank-container">
      <div className="prank-content">
        <div className="warning-icon">⚠️</div>
        <h1 className="prank-title">Copyright Violation Detected</h1>
        
        <div className="prank-image">
          <img 
            src={process.env.PUBLIC_URL + "/swedish-protective-security-act.jpg"} 
            alt="Swedish Protective Security Act" 
            className="security-image"
          />
        </div>
        
        <div className="prank-message">
          <p className="english-text">
            You have been caught stealing someone else's content and violating copyright laws. 
            We are opening a criminal case.
          </p>
          
          <p className="swedish-text">
            Du har blivit påkommen med att stjäla andras innehåll och bryta mot upphovsrätten. 
            Vi inleder ett brottmål.
          </p>
        </div>
        
        <div className="prank-actions">
          <button 
            className="back-btn" 
            onClick={() => window.history.back()}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrankPage;
