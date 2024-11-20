import React, { useState } from "react";
import "../css/Navbar.css";
import SidePanel from "./SidePanel";

function Navbar({ onLogout, showHomeButton, onBackToExplore, onBackToCreate, isCreateMode, createMapName, onPublish, currentRoute, onExplore }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
      {(isCreateMode || showHomeButton) ? (
        <button className="global-view-button" onClick={onBackToExplore}>
          Back to Explore
        </button>
      ) : (
        <>
          <div className="hamburger navbar-button" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <button className="navbar-button">Filters</button>
        </>
      )}
      </div>

      {/* Centered "Global View" button */}
      <div className="navbar-center">
        {showHomeButton && !isCreateMode && (
          <b className="map-name-display">{currentRoute.title}</b>
        )}
        {isCreateMode && (
          <b className="map-name-display">{createMapName}</b>
        )}
      </div>

      <div className="navbar-right">
      {isCreateMode && (
        <button className="navbar-button logout-button" onClick={onPublish}>Publish</button>
      )}
      {!isCreateMode && (
        <button className="navbar-button logout-button" onClick={onExplore}>Explore</button>
      )}
      </div>

      <SidePanel
        onLogout={onLogout}
        isMenuOpen={isMenuOpen} // Default state for the side panel
        toggleMenu={toggleMenu}
        onCreateMode={onBackToCreate} // Pass the function to switch to create mode
      />
    </nav>
  );
}

export default Navbar;
