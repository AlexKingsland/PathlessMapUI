import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SidePanel.css";

function SidePanel({ onLogout, isMenuOpen, toggleMenu, onCreateMode }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [createMapName, setCreateMapName] = useState(""); // Ensure createMapName is defined as a state variable
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    toggleMenu(); // Close the menu when logging out
  };

  const handleCreateMapClick = () => {
    setCreateMapName(""); // Reset the map name input field
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onCreateMode && createMapName.trim()) {
      onCreateMode(createMapName); // Pass the map name to the create mode function
      setIsFormVisible(false); // Hide the form after submission
      toggleMenu(); // Close the menu
    } else {
      console.log("onCreateMode not called: either createMapName is empty or function is not defined."); // Debug line
    }
  };

  return (
    <div className={`side-pane ${isMenuOpen ? "open" : ""}`}>
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
