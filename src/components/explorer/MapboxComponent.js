import React, { useEffect, useRef, useState } from "react";
import { getRoutes, calculateCenter } from "../../waypoints";
import WaypointDetailsPanel from "./WaypointDetailsPanel";

const MapboxComponent = ({ resetToTopLevelView }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isGlobalView, setIsGlobalView] = useState(true);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const routes = getRoutes();

  useEffect(() => {
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

      const newMap = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 20],
        zoom: 1.5,
      });

      newMap.addControl(new window.mapboxgl.NavigationControl());
      setMap(newMap);

      // Only set resetToTopLevelView after map is initialized
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
      } else if (currentRouteIndex !== null) {
        drawRoute(routes[currentRouteIndex]);
      }
    }
  }, [map, isGlobalView, currentRouteIndex]);

  const clearMap = () => {
    if (map.getLayer("route")) map.removeLayer("route");
    if (map.getSource("route-line")) map.removeSource("route-line");
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  };

  const drawTopLevelMarkers = () => {
    routes.forEach((route, index) => {
      const center = calculateCenter(route.waypoints);
      const markerElement = document.createElement("div");
      markerElement.style.background = "#5c3b28";
      markerElement.style.width = "30px";
      markerElement.style.height = "30px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.color = "white";
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.textContent = index + 1;

      new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([center.lon, center.lat])
        .addTo(map)
        .getElement()
        .addEventListener("click", () => zoomIntoRoute(index));
    });
  };

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
  };

  const goToGlobalView = (mapInstance = map) => {
    if (mapInstance) {
      setIsGlobalView(true);
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
    </div>
  );
};

export default MapboxComponent;
