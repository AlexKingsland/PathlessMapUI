import React from 'react';
import '../css/RouteOverviewPanel.css';

const RouteOverviewPanel = ({ routes, onHoverRoute, onLeaveRoute, onClickRoute }) => {
  return (
    <div className="route-overview-panel">
      {routes.map((route, index) => (
        <div
          key={index}
          className="route-box"
          onMouseEnter={() => onHoverRoute(index)}
          onMouseLeave={onLeaveRoute(index)}
          onClick={() => onClickRoute(index)}
        >
          <div className="route-title">{route.title}</div>
          <div className="route-content">
            <div className="route-image-placeholder">
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