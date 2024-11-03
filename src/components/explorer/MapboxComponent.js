import React, { useEffect, useRef, useState } from "react";
import { getRoutes, calculateCenter } from "../../waypoints"; // Import waypoints and helper
import WaypointDetailsPanel from "./WaypointDetailsPanel"; // Import the new WaypointDetailsPanel component

const MapboxComponent = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isGlobalView, setIsGlobalView] = useState(true); // Track if we're in global or zoomed-in view
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null); // Track the current selected route
  const [selectedWaypoint, setSelectedWaypoint] = useState(null); // Track the selected waypoint
  const routes = getRoutes(); // Get the routes from the external file

  useEffect(() => {
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

      const newMap = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 20], // Global view center
        zoom: 1.5,
      });

      newMap.addControl(new window.mapboxgl.NavigationControl());
      setMap(newMap);
    }
  }, []);

  useEffect(() => {
    if (map) {
      // Clear all layers and markers before drawing
      clearMap();

      if (isGlobalView) {
        drawTopLevelMarkers();
      } else if (currentRouteIndex !== null) {
        drawRoute(routes[currentRouteIndex]);
      }
    }
  }, [map, isGlobalView, currentRouteIndex]);

  const clearMap = () => {
    // Clear layers and sources if they exist
    if (map.getLayer("route")) {
      map.removeLayer("route");
    }
    if (map.getSource("route-line")) {
      map.removeSource("route-line");
    }
    // Remove all markers
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  };

  // Draw top-level markers at the center of each route
  const drawTopLevelMarkers = () => {
    routes.forEach((route, index) => {
      const center = calculateCenter(route.waypoints);

      const markerElement = document.createElement("div");
      markerElement.style.background = "blue";
      markerElement.style.width = "30px";
      markerElement.style.height = "30px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.color = "white";
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.textContent = index + 1;

      // When the marker is clicked, zoom into the route
      new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([center.lon, center.lat])
        .addTo(map)
        .getElement()
        .addEventListener("click", () => zoomIntoRoute(index));
    });
  };

  // Draw the specific route
  const drawRoute = (route) => {
    const lineString = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route.waypoints.map((wp) => [wp.lon, wp.lat]),
      },
    };

    map.addSource("route-line", {
      type: "geojson",
      data: lineString,
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route-line",
      layout: {},
      paint: {
        "line-color": "#f09990",
        "line-width": 4,
      },
    });

    // Add markers for the waypoints
    route.waypoints.forEach((waypoint, index) => {
      const markerElement = document.createElement("div");
      markerElement.style.background = "red";
      markerElement.style.width = "20px";
      markerElement.style.height = "20px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.color = "white";
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.textContent = index + 1;

      const marker = new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([waypoint.lon, waypoint.lat])
        .addTo(map);

      // Add click event to open the details panel
      marker.getElement().addEventListener("click", () => {
        setSelectedWaypoint(waypoint); // Show details of the clicked waypoint
      });
    });

    // Zoom into the route
    const bounds = new window.mapboxgl.LngLatBounds();
    route.waypoints.forEach((wp) => bounds.extend([wp.lon, wp.lat]));
    map.fitBounds(bounds, { padding: 50 });
  };

  // Zoom into a specific route
  const zoomIntoRoute = (index) => {
    setCurrentRouteIndex(index);
    setIsGlobalView(false);
  };

  // Go back to the global view
  const goToGlobalView = () => {
    setIsGlobalView(true);
    setCurrentRouteIndex(null);
    setSelectedWaypoint(null); // Clear the details panel
    map.flyTo({ center: [0, 20], zoom: 1.5 });
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }} />
      {!isGlobalView && (
        <button
          onClick={goToGlobalView}
          style={{ position: "absolute", top: 10, left: 10 }}
        >
          Top Level View
        </button>
      )}

      {/* Pass the selected waypoint to the WaypointDetailsPanel */}
      <WaypointDetailsPanel
        waypoint={selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)} // Close the panel
      />
    </div>
  );
};

export default MapboxComponent;
