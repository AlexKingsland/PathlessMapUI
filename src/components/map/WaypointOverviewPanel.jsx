import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/map/WaypointOverviewPanel.css";

const WaypointOverviewPanel = ({
  route,
  onHoverWaypoint,
  onLeaveWaypoint,
  onClickWaypoint,
  isPanelOpen,
  togglePanel,
  waypointMarkerRefs,
  setSelectedWaypoint,
}) => {
  const navigate = useNavigate();

  const handleCreatorClick = () => {
    if (route.creator?.alias) {
      console.log("Navigating to:", `/user/${route.creator.alias}`);  // Debug log
      navigate(`/user/${route.creator.alias}`);
    } else {
      console.error("Alias is missing for creator:", route.creator);
    }
    setSelectedWaypoint(null);
  };

  const handleBoxHover = (index) => {
    const markerElement = waypointMarkerRefs.current[index];
    if (markerElement) {
      markerElement.classList.add("hovered-waypoint-marker");
    }
  };

  const handleBoxLeave = (index) => {
    const markerElement = waypointMarkerRefs.current[index];
    if (markerElement) {
      markerElement.classList.remove("hovered-waypoint-marker");
    }
  };

  return (
    <>
      <div
        className={`waypoint-overview-panel ${
          isPanelOpen ? "panel-open" : "panel-closed"
        }`}
      >
        {/* Route Metadata Section - Static */}
        <div className="map-metadata">
            <div className="map-image-container">
            <img 
                src={
                route.image_data
                    ? `data:image/jpeg;base64,${route.image_data}` // Replace with image field from your route object
                    : "https://via.placeholder.com/100" // Fallback placeholder
                }
                alt={route.title || "Map Image"} 
                className="map-image" 
            />
            </div>
            <h2>{route.title || "Untitled Map"}</h2>
            <p>
              <strong>Creator:</strong>{" "}
              <span 
                className="creator-link" 
                onClick={() => handleCreatorClick()}
              >
                {route.creator.name || "Unknown"}
              </span>
            </p>
            <p>
                <strong>Destinations:</strong> {route.waypoints.length}
            </p>
            <p>
                <strong>Description:</strong> {route.description || "No description available"}
            </p>
        </div>

        {/* Waypoints List - Scrollable */}
        <div className="waypoints-list">
          {route.waypoints.length === 0 ? (
            <div className="no-waypoints-message">
              Sorry, no waypoints available.
            </div>
          ) : (
            route.waypoints.map((waypoint, index) => (
              <div
                key={index}
                className="waypoint-box"
                onMouseEnter={() => {
                  onHoverWaypoint(index);
                  handleBoxHover(index);
                }}
                onMouseLeave={() => {
                  onLeaveWaypoint();
                  handleBoxLeave(index);
                }}
                onClick={() => onClickWaypoint(index)}
              >
                <div className="waypoint-title">{waypoint.title}</div>
                <div className="waypoint-content">
                  <div className="waypoint-image-placeholder">
                    <img
                      src={
                        waypoint.image_data
                          ? `data:image/jpeg;base64,${waypoint.image_data}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={waypoint.title || "Waypoint image"}
                      className="waypoint-image"
                    />
                  </div>
                  <div className="waypoint-details">
                    <p>
                      <strong>Description:</strong> {waypoint.description || "No description available"}
                    </p>
                    <p>
                      <strong>Info:</strong> {waypoint.info || "N/A"}
                    </p>
                    <p>
                      <strong>Duration:</strong> {waypoint.duration || "N/A"}
                    </p>
                    <p>
                      <strong>Price:</strong> {waypoint.price ? `$${waypoint.price}` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel Toggle Button */}
      <div
        className="toggle-panel-tab"
        onClick={togglePanel}
        style={{
          left: isPanelOpen ? "calc(20% + 5px)" : "5px",
          transition: "left 0.3s ease",
        }}
      >
        {isPanelOpen ? "❮" : "❯"}
      </div>
    </>
  );
};

export default WaypointOverviewPanel;
