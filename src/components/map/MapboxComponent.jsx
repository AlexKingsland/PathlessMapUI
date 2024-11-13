import React, { useEffect, useRef, useState } from "react";
import { calculateCenter } from "../../waypoints";
import WaypointDetailsPanel from "./WaypointDetailsPanel";
import "../../css/map/MapboxComponent.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import WaypointFormPanel from "./WaypointFormPanel"; // Import the new component

const MapboxComponent = ({ resetToTopLevelView, toggleGlobalView, routes, addWaypointToUserRoutes, isFormPanelVisible, setIsFormPanelVisible }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isGlobalView, setIsGlobalView] = useState(true);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);

  useEffect(() => {
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

      const newMap = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 20],
        zoom: 1.5,
      });

      newMap.addControl(new window.mapboxgl.NavigationControl());
      setMap(newMap);

      if (resetToTopLevelView) {
        resetToTopLevelView(() => goToGlobalView(newMap));
      }
    }
  }, []);

  useEffect(() => {
    if (map) {
      clearMap();
      if (isGlobalView) {
        drawTopLevelMarkers();
      } else if (currentRouteIndex !== null && routes[currentRouteIndex]) {
        drawRoute(routes[currentRouteIndex]);
      }
    }
  }, [map, isGlobalView, currentRouteIndex, routes]);

  const clearMap = () => {
    if (map.getLayer("route")) map.removeLayer("route");
    if (map.getSource("route-line")) map.removeSource("route-line");
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  };

  const drawTopLevelMarkers = () => {
    if (!routes || routes.length === 0) return;

    routes.forEach((route, index) => {
      const center = calculateCenter(route.waypoints);

      const markerElement = document.createElement("div");
      markerElement.className = "top-level-marker";
      markerElement.textContent = index + 1;

      new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([center.lon, center.lat])
        .addTo(map)
        .getElement()
        .addEventListener("click", () => zoomIntoRoute(index));
    });
  };

  const drawRoute = (route) => {
    if (!route || !route.waypoints) return;

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

    route.waypoints.forEach((waypoint, index) => {
      const markerElement = document.createElement("div");
      markerElement.className = "waypoint-marker";
      markerElement.textContent = index + 1;

      const marker = new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([waypoint.lon, waypoint.lat])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        setSelectedWaypoint(waypoint);
      });
    });

    const bounds = new window.mapboxgl.LngLatBounds();
    route.waypoints.forEach((wp) => bounds.extend([wp.lon, wp.lat]));
    map.fitBounds(bounds, { padding: 50 });
  };

  const zoomIntoRoute = (index) => {
    setCurrentRouteIndex(index);
    setIsGlobalView(false);
    toggleGlobalView(false);
  };

  const goToGlobalView = (mapInstance = map) => {
    if (mapInstance) {
      setIsGlobalView(true);
      toggleGlobalView(true);
      setCurrentRouteIndex(null);
      setSelectedWaypoint(null);
      mapInstance.flyTo({ center: [0, 20], zoom: 1.5 });
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }} />
      <WaypointDetailsPanel
        waypoint={selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)}
      />
      {isFormPanelVisible && (
        <WaypointFormPanel
          onAddWaypoint={addWaypointToUserRoutes} // Pass the function to add waypoints
          onClose={() => setIsFormPanelVisible(false)}
        />
      )}
    </div>
  );
};

export default MapboxComponent;
