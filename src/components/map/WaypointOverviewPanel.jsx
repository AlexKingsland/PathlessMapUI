import React from "react";
import "../../css/map/WaypointOverviewPanel.css";

const WaypointOverviewPanel = ({
  route,
  onHoverWaypoint,
  onLeaveWaypoint,
  onClickWaypoint,
  isPanelOpen,
  togglePanel,
  waypointMarkerRefs,
}) => {
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
            {route.map_image && (
                <div className="map-image-container">
                <img 
                    src={route.map_image} 
                    alt={route.title || "Map Image"} 
                    className="map-image" 
                />
                </div>
            )}
            <h2>{route.title || "Untitled Map"}</h2>
            <p>{route.description || "No description available"}</p>
            <p>
                <strong>Creator:</strong> {route.creator || "Unknown"}
            </p>
            <p>
                <strong>Total Waypoints:</strong> {route.waypoints.length}
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
