import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import SidePanel from "./SidePanel";

function Navbar({ onLogout, onHomeClick, showHomeButton }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Hamburger Menu Icon */}
        <div className="hamburger navbar-button" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Filters button */}
        <button className="navbar-button">Filters</button>
      </div>

      {/* Centered "Back to Global View" button */}
      <div className="navbar-center">
        {showHomeButton && (
          <button className="global-view-button" onClick={onHomeClick}>
            Back to Global View
          </button>
        )}
      </div>

      <div className="navbar-right">
        <button className="navbar-button logout-button">Explore</button>
      </div>

      {/* Side Panel */}
      <SidePanel onLogout={onLogout} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </nav>
  );
}

export default Navbar;
