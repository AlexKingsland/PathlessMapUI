import React from "react";
import "../../css/map/WaypointDetailsPanel.css";

const WaypointDetailsPanel = ({ waypoint, onClose }) => {
  if (!waypoint) {
    return null; // Don't render anything if no waypoint is selected
  }

  return (
    <div className="waypoint-details-panel">
      <button className="waypoint-details-close-btn" onClick={onClose}>
        ✕
      </button>
      <h3>{waypoint.title}</h3>
      <p><strong>Info:</strong> {waypoint.info}</p>
      <p><strong>Description:</strong> {waypoint.description}</p>
      <p><strong>Duration:</strong> {waypoint.duration}</p>
      <p><strong>Price:</strong> ${waypoint.price}</p>
    </div>
  );
};

export default WaypointDetailsPanel;
