import React from "react";
import "../css/RouteOverviewPanel.css"; // Import the CSS file

const RouteOverviewPanel = ({ routes }) => {
  return (
    <div className="route-overview-panel">
      {routes.map((route, index) => (
        <div className="route-box" key={index}>
          <h3 className="route-title">{route.title}</h3>
          <div className="route-content">
            <div className="route-image-placeholder">
              {/* Placeholder image, replace with route.image eventually */}
              <img
                src="https://via.placeholder.com/100"
                alt="Route placeholder"
                className="route-image"
              />
            </div>
            <div className="route-details">
              <p><strong>Description:</strong> {route.description || "No description available"}</p>
              <p><strong>Rating:</strong> {route.rating.average_rating ? `${route.rating.average_rating} / 5` : "N/A"}</p>
              <p><strong>Duration:</strong> {route.duration || "N/A"}</p>
              <p><strong>Price:</strong> {route.price ? `$${route.price.toFixed(2)}` : "N/A"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteOverviewPanel;
