import React, { useRef, useState } from "react";
import "../css/Navbar.css";
import SidePanel from "./SidePanel";
import FilterPanel from "./FilterPanel";

function Navbar({ onLogout, showHomeButton, onBackToExplore, onBackToCreate, isCreateMode, createMapName, onPublish, currentRoute, onExplore, userRoutes, fetchRoutes, currentlyShowingFilteredDownMaps, setCurrentlyShowingFilteredDownMaps, isEditMode, onSaveEdits, currentUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const filterButtonRef = useRef(null);
  const [isFiltersPanelVisible, setIsFiltersPanelVisible] = useState(false);

  const toggleFiltersPanel = () => {
    setIsFiltersPanelVisible(!isFiltersPanelVisible);
  };

  const onCloseFilters = () => {
    setIsFiltersPanelVisible(false);
  };

  const handleApplyFilters = (filters) => {
    console.log("Applied Filters:", filters);
    setIsFiltersPanelVisible(false); // Close the panel after applying
    fetchRoutes(filters); // Call your API with the applied filters
  };

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
            <button ref={filterButtonRef} className="navbar-button" onClick={toggleFiltersPanel}>
              Filters
            </button>
            {isFiltersPanelVisible && (
              <FilterPanel onApplyFilters={handleApplyFilters} onCloseFilters={onCloseFilters} filterButtonRef={filterButtonRef} />
            )}
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
        {isCreateMode && !isEditMode && (
          <button
            className="navbar-button logout-button"
            onClick={onPublish}
            disabled={userRoutes[0].waypoints.length === 0}
          >
            Publish
          </button>
        )}

        {isEditMode && (
          <button
            className="navbar-button logout-button"
            onClick={onSaveEdits}
            disabled={userRoutes[0].waypoints.length === 0}
          >
            Save Changes
          </button>
        )}

        {!isCreateMode && !isEditMode && !currentlyShowingFilteredDownMaps && (
          <button
            className="navbar-button global-view-button"
            onClick={onExplore}
          >
            Explore
          </button>
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
        currentUser={currentUser}
      />
    </nav>
  );
}

export default Navbar;
