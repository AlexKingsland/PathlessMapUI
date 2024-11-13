import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/SidePanel.css";

function SidePanel({ onLogout, isMenuOpen, toggleMenu, onCreateMode }) {
  // Debugging line to confirm prop reception
  console.log("onCreateMode prop:", onCreateMode);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    toggleMenu(); // Close the menu when logging out
  };

  return (
    <div className={`side-pane ${isMenuOpen ? "open" : ""}`}>
      <button className="side-pane-button" onClick={() => navigate("/profile")}>Pathless Profile</button>
      <button className="side-pane-button" onClick={() => navigate("/account-details")}>Account Details</button>
      <button className="side-pane-button" onClick={() => navigate("/saved-maps")}>Saved Maps</button>
      <button
        className="side-pane-button"
        onClick={() => {
          if (onCreateMode) {
            console.log("Create a Map clicked"); // Debug line to check if this runs
            onCreateMode(); // Ensure this is invoked correctly
          }
          toggleMenu(); // Optionally close the menu
        }}
      >
        Create a Map
      </button>

      <div className="side-pane-logout">
        <button className="side-pane-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default SidePanel;
