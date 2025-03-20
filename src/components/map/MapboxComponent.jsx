import React, { useEffect, useRef, useState } from "react";
import { calculateCenter } from "../../waypoints";
import WaypointDetailsPanel from "./WaypointDetailsPanel";
import "../../css/map/MapboxComponent.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import WaypointFormPanel from "./WaypointFormPanel";

const MapboxComponent = ({ resetToTopLevelView, toggleGlobalView, isGlobalView, routes, addWaypointToUserRoutes, isFormPanelVisible, waypointFormPanelVisible, toggleWaypointFormPanel, isCreateMode, onUpdateWaypoint, selectedWaypoint, setSelectedWaypoint, setCurrentRouteIndex, currentRouteIndex, handleHoverRoute, handleLeaveRoute, handleHoverWaypoint, handleLeaveWaypoint, mapContainerRef, map, setMap, resetHighlightedMarkers, markerRefs, waypointMarkerRefs, setIsCreateMapModalVisible, isCreateMapModalVisible }) => {

  useEffect(() => {
    if (window.mapboxgl && mapContainerRef.current) {
      window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  
      const newMap = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 20],
        zoom: 1.5,
      });
  
      newMap.addControl(new window.mapboxgl.NavigationControl());
  
      // Wait until style is fully loaded before doing anything else
      newMap.on("style.load", () => {
        console.log("Map style loaded");
        setMap(newMap); // only set map after style is ready
  
        if (resetToTopLevelView) {
          resetToTopLevelView(() => goToGlobalView(newMap));
        }
      });
  
      return () => {
        newMap.remove();
      };
    }
  }, []);
  

  useEffect(() => {
    if (!map) return;
  
    const runMapDrawing = () => {
      console.log("Map style loaded, running drawing logic");
      clearMap();

      // Check if there is a selected route in local storage
      const selectedMapId = localStorage.getItem("selectedRouteId");
      if (selectedMapId && routes.length > 0) {
        const matchingIndex = routes.findIndex((route) => route.id === parseInt(selectedMapId));
        if (matchingIndex !== -1) {
          setCurrentRouteIndex(matchingIndex);
        }
        localStorage.removeItem("selectedRouteId");
      }
  
      if (isCreateMode) {
        setCurrentRouteIndex(0);
        if (routes[0]) {
          drawRoute(routes[0]);
        }
      } else if (isGlobalView) {
        drawTopLevelMarkers();
      } else if (currentRouteIndex !== null && routes[currentRouteIndex]) {
        drawRoute(routes[currentRouteIndex]);
      }
    };
  
    // Style load checker polling loop
    const waitForStyleLoad = () => {
      if (map.isStyleLoaded()) {
        runMapDrawing();
      } else {
        requestAnimationFrame(waitForStyleLoad); // keep checking until it's ready
      }
    };
  
    waitForStyleLoad(); // Start checking
  
  }, [map, isGlobalView, currentRouteIndex, routes]);
  

  const clearMap = () => {
    try {
      if (map && map.getLayer("route")) {
        map.removeLayer("route");
      }
  
      if (map && map.getSource("route-line")) {
        map.removeSource("route-line");
      }
  
      document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  
      resetHighlightedMarkers();
      markerRefs.current = {};
    } catch (err) {
      console.warn("Error during map cleanup:", err);
    }
  };
  

  const drawTopLevelMarkers = () => {
    if (!routes || routes.length === 0) return;

    routes.forEach((route, index) => {
      const center = calculateCenter(route.waypoints);

      const markerElement = document.createElement("div");
      markerElement.className = "top-level-marker";
      markerElement.textContent = index + 1;

      new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat([center.longitude, center.latitude])
        .addTo(map);

      markerRefs.current[index] = markerElement;

      markerElement.addEventListener("click", () => zoomIntoRoute(index));
      markerElement.addEventListener("mouseover", () => handleHoverRoute(index));
      markerElement.addEventListener("mouseout", handleLeaveRoute);
    });
  };

  // this function is used to draw routes for both explore [n] and create [0] UI
  const drawRoute = (route) => {
    if (!route || !route.waypoints || route.waypoints.length === 0) return;
    console.log("Drawing route with waypoints:", route.waypoints); // Debug line

    const lineString = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route.waypoints.map((wp) => [wp.longitude, wp.latitude]),
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
        .setLngLat([waypoint.longitude, waypoint.latitude])
        .addTo(map);

      waypointMarkerRefs.current[index] = markerElement;

      marker.getElement().addEventListener("click", () => {
        setSelectedWaypoint(waypoint);
      });
      markerElement.addEventListener("mouseover", () => handleHoverWaypoint(index));
      markerElement.addEventListener("mouseout", handleLeaveWaypoint);
    });

    const bounds = new window.mapboxgl.LngLatBounds();
    route.waypoints.forEach((wp) => bounds.extend([wp.longitude, wp.latitude]));
    map.fitBounds(bounds, { padding: 50 });
  };

  const zoomIntoRoute = (index) => {
    setCurrentRouteIndex(index);
    toggleGlobalView(false);
  };

  const goToGlobalView = (mapInstance = map) => {
    if (mapInstance) {
      toggleGlobalView(true);
      setCurrentRouteIndex(null);
      setSelectedWaypoint(null);
      mapInstance.flyTo({ center: [0, 20], zoom: 1.5 });
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100vw", height: "calc(100vh - 53px)" }} />
      <WaypointDetailsPanel
        waypoint={selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)}
      />
      {isCreateMode && (
        <WaypointFormPanel
          onAddWaypoint={addWaypointToUserRoutes}
          onUpdateWaypoint={onUpdateWaypoint}
          isPanelOpen={waypointFormPanelVisible}
          togglePanel={toggleWaypointFormPanel}
          isCreateMapModalVisible={isCreateMapModalVisible}
          setIsCreateMapModalVisible={setIsCreateMapModalVisible}
        />
      )}
    </div>
  );
};

export default MapboxComponent;
