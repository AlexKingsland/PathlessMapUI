import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateMapModal from "./CreateMapModal"; // Import the modal component
import "../css/SidePanel.css";

function SidePanel({ onLogout, isMenuOpen, toggleMenu, onCreateMode, menuButtonRef }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
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
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      <div ref={panelRef} className={`side-pane ${isMenuOpen ? "open" : ""}`}>
        <button className="side-pane-button" onClick={() => navigate("/profile")}>
          Pathless Profile
        </button>
        <button className="side-pane-button" onClick={() => navigate("/account-details")}>
          Account Details
        </button>
        <button className="side-pane-button" onClick={() => navigate("/saved-maps")}>
          Saved Maps
        </button>

        <div className="create-map-container">
          <button
            className="side-pane-button create-map-button"
            onClick={handleCreateMapClick}
          >
            Create a Map
          </button>
        </div>

        <div className="side-pane-logout">
          <button className="side-pane-button logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Show the CreateMapModal */}
      {isModalVisible && (
        <CreateMapModal onClose={handleModalClose} onCreateMode={onCreateMode} toggleMenu={toggleMenu} />
      )}
    </>
  );
}

export default SidePanel;
