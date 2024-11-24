import React from "react";
import "../css/RouteOverviewPanel.css";

const RouteOverviewPanel = ({
  routes,
  onHoverRoute,
  onLeaveRoute,
  onClickRoute,
  isPanelOpen,
  togglePanel,
  markerRefs,
}) => {
  const handleBoxHover = (index) => {
    const markerElement = markerRefs.current[index];
    if (markerElement) {
      markerElement.classList.add("hovered-top-level-marker");
    }
  };

  const handleBoxLeave = (index) => {
    const markerElement = markerRefs.current[index];
    if (markerElement) {
      markerElement.classList.remove("hovered-top-level-marker");
    }
  };

  return (
    <>
      <div
        className={`route-overview-panel ${
          isPanelOpen ? "panel-open" : "panel-closed"
        }`}
      >
        {routes.length === 0 ? (
          <div className="no-routes-message">
            Sorry, no routes match this filter.
          </div>
        ) : (
          routes.map((route, index) => (
            <div
              key={index}
              className="route-box"
              onMouseEnter={() => {
                onHoverRoute(index);
                handleBoxHover(index);
              }}
              onMouseLeave={() => {
                onLeaveRoute();
                handleBoxLeave(index);
              }}
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
                  <p>
                    <strong>Description:</strong>{" "}
                    {route.description || "No description available"}
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {route.rating?.average_rating
                      ? `${route.rating.average_rating} / 5`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Duration:</strong> {route.duration || "N/A"}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    {route.price ? `$${route.price.toFixed(2)}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div
        className="toggle-panel-tab"
        onClick={togglePanel}
        style={{
          left: isPanelOpen ? "calc(20% + 5px)" : "5px",
          transition: "left 0.3s ease", // Ensure smooth transition for the toggle
        }}
      >
        {isPanelOpen ? "❮" : "❯"}
      </div>
    </>
  );
};

export default RouteOverviewPanel;
