import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateMapModal from "./CreateMapModal"; // Import the modal component
import "../css/SidePanel.css";

function SidePanel({ onLogout, isMenuOpen, toggleMenu, onCreateMode, menuButtonRef, fetchRoutes, setCurrentlyShowingFilteredDownMaps }) {
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
    toggleMenu(false); // Automatically close the side panel
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  const fetchUserId = () => {
    const token = localStorage.getItem("token");
  
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format. Token should have three parts separated by dots.");
      return null;
    }
  
    try {
      const payload = JSON.parse(atob(parts[1])); // Decode JWT payload
      const userId = payload.sub?.id; // Extract `id` from `sub`
      if (!userId) {
        console.error("User ID not found in token payload.");
        return null;
      }
      return userId;
    } catch (error) {
      console.error("Failed to decode token payload:", error);
      return null;
    }
  };

  const handleFetchMyMaps = async () => {
    const userId = await fetchUserId();
    if (userId) {
      setCurrentlyShowingFilteredDownMaps(true);
      fetchRoutes({ creator_id: userId }); // Fetch routes filtered by the user's ID
      toggleMenu(false);
    } else {
      console.error("Could not fetch user ID");
      alert("Failed to fetch your maps. Please try again.");
    }
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
        <button className="side-pane-button" onClick={handleFetchMyMaps}>
          My Maps
        </button>
        <button className="side-pane-button" onClick={() => navigate("/saved-maps")}>
          Saved Maps
        </button>

        <div className="create-map-container">
          <button className="side-pane-button create-map-button" onClick={handleCreateMapClick}>
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
        <CreateMapModal onClose={handleModalClose} onCreateMode={onCreateMode} onEditMode={onCreateMode} mode={"create"} />
      )}
    </>
  );
}

export default SidePanel;
