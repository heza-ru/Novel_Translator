import React from 'react';

// Basic styling for "preloader-container" and "spinner" will be handled 
// in a separate CSS file (e.g., App.css or a dedicated Preloader.css) later.
// This component defines the structure for the preloader.

const Preloader = () => {
  return (
    <div className="preloader-container" aria-busy="true" role="status">
      <div className="spinner"></div>
      {/* Optional: Loading text can be added here if needed, for example:
      <p className="loading-text">Loading...</p> 
      */}
    </div>
  );
};

export default Preloader;
