import React, { useRef, useState } from "react";
import "../css/Navbar.css";
import SidePanel from "./SidePanel";

function Navbar({ onLogout, showHomeButton, onBackToExplore, onBackToCreate, isCreateMode, createMapName, onPublish, currentRoute, onExplore, userRoutes, fetchRoutes, currentlyShowingFilteredDownMaps, setCurrentlyShowingFilteredDownMaps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isCreateMode || showHomeButton || currentlyShowingFilteredDownMaps ? (
          <>
            {/* Show 'Back' if currentlyShowingFilteredDownMaps is true AND showHomeButton is true */}
            {currentlyShowingFilteredDownMaps && showHomeButton ? (
              <button className="global-view-button" onClick={() => onBackToExplore(false, true)}>
                Back
              </button>
            ) : (
              /* Show 'Home' only if currentlyShowingFilteredDownMaps is false OR showHomeButton is true */
              <button className="global-view-button" onClick={() => onBackToExplore(currentlyShowingFilteredDownMaps, false)}>
                Home
              </button>
            )}
          </>
        ) : (
          <>
            <div ref={menuButtonRef} className="hamburger navbar-button" onClick={toggleMenu}>
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
        {showHomeButton && !isCreateMode && !currentlyShowingFilteredDownMaps && (
          <b className="map-name-display">{currentRoute.title}</b>
        )}
        {isCreateMode && !currentlyShowingFilteredDownMaps && (
          <b className="map-name-display">{createMapName}</b>
        )}
        {currentlyShowingFilteredDownMaps && (
          <b className="map-name-display">My Maps</b>
        )}
      </div>

      <div className="navbar-right">
      {isCreateMode && (
        <button className="navbar-button logout-button" onClick={onPublish} disabled={userRoutes[0].waypoints.length === 0}>Publish</button>
      )}
      {(!isCreateMode && !currentlyShowingFilteredDownMaps) && (
        <button className="navbar-button logout-button" onClick={onExplore}>Explore</button>
      )}
      </div>

      <SidePanel
        onLogout={onLogout}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCreateMode={onBackToCreate}
        menuButtonRef={menuButtonRef}
        fetchRoutes={fetchRoutes}
        setCurrentlyShowingFilteredDownMaps={setCurrentlyShowingFilteredDownMaps}
      />
    </nav>
  );
}

export default Navbar;
