import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import SidePanel from "./SidePanel";

function Navbar({ onLogout, onHomeClick, showHomeButton, showBackToExploreButton, onBackToExplore, onBackToCreate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="hamburger navbar-button" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <button className="navbar-button">Filters</button>
      </div>

      {/* Centered "Global View" button */}
      <div className="navbar-center">
        {showHomeButton && (
          <button className="global-view-button" onClick={onHomeClick}>
            Global View
          </button>
        )}
      </div>

      {/* Centered "Back to Explore" button */}
      <div className="navbar-center">
        {showBackToExploreButton && (
          <button className="global-view-button" onClick={onBackToExplore}>
            Back to Explore
          </button>
        )}
      </div>

      <div className="navbar-right">
        <button className="navbar-button logout-button">Explore</button>
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
