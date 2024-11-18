import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SidePanel.css";

function SidePanel({ onLogout, isMenuOpen, toggleMenu, onCreateMode }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [createMapName, setCreateMapName] = useState("");
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // If clicked outside of the panel, close it
        toggleMenu(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    toggleMenu();
  };

  const handleCreateMapClick = () => {
    setCreateMapName(""); // Reset the map name input field
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onCreateMode && createMapName.trim()) {
      onCreateMode(createMapName);
      setIsFormVisible(false);
      toggleMenu();
    } else {
      console.log("onCreateMode not called: either createMapName is empty or function is not defined."); // Debug line
    }
  };

  return (
    <div ref={panelRef} className={`side-pane ${isMenuOpen ? "open" : ""}`}>
      <button className="side-pane-button" onClick={() => navigate("/profile")}>Pathless Profile</button>
      <button className="side-pane-button" onClick={() => navigate("/account-details")}>Account Details</button>
      <button className="side-pane-button" onClick={() => navigate("/saved-maps")}>Saved Maps</button>
      
      <div className="create-map-container">
        <button
          className="side-pane-button create-map-button"
          onClick={handleCreateMapClick}
        >
          Create a Map
        </button>
        {isFormVisible && (
          <form onSubmit={handleFormSubmit} className="create-map-form">
            <input
              type="text"
              placeholder="Enter Map Name"
              value={createMapName}
              onChange={(e) => setCreateMapName(e.target.value)}
              className="map-name-input"
            />
          </form>
        )}
      </div>

      <div className="side-pane-logout">
        <button className="side-pane-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default SidePanel;
