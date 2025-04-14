import React from "react";
import "../../css/map/WaypointDetailsPanel.css";

const WaypointDetailsPanel = ({ waypoint, onClose }) => {
  if (!waypoint) return null;

  const imageSrc = waypoint.image_data
    ? waypoint.image_data.startsWith("data:image/")
      ? waypoint.image_data
      : `data:image/jpeg;base64,${waypoint.image_data}`
    : "/placeholder.jpg";

  return (
    <div className="waypoint-details-panel">
      <button className="waypoint-details-close-btn" onClick={onClose}>✕</button>
      
      <h3 className="waypoint-title">{waypoint.title}</h3> {/* Move title above content */}

      <div className="waypoint-details-content">
        <div className="waypoint-image-container">
          <img src={imageSrc} alt={waypoint.title} className="waypoint-image" />
        </div>
        <div className="waypoint-text">
          <p><strong>Info:</strong> {waypoint.info}</p>
          <p><strong>Description:</strong> {waypoint.description}</p>
          <p><strong>Duration:</strong> {waypoint.duration}</p>
          <p><strong>Price:</strong> ${waypoint.price}</p>
        </div>
      </div>
    </div>
  );
};

export default WaypointDetailsPanel;
