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
      <h3>{waypoint.name}</h3>
      <p><strong>Rating:</strong> {waypoint.rating}</p>
      <p><strong>Notes:</strong> {waypoint.notes}</p>
      <p><strong>Description:</strong> {waypoint.description}</p>
    </div>
  );
};

export default WaypointDetailsPanel;
