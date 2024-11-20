import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MapboxComponent from "./components/map/MapboxComponent";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import RouteOverviewPanel from "./components/RouteOverviewPanel";
import Navbar from "./components/Navbar";
import { getRoutes } from "./waypoints"; // Import getRoutes function

function App() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const highlightedMarkersRef = useRef([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isGlobalView, setIsGlobalView] = useState(true); // Track global vs. zoomed-in view
  const [showBackToExploreButton, setShowBackToExploreButton] = useState(false); // Track if "Back to Explore" button is shown
  const goToTopLevelViewRef = useRef(null);
  const [exploreRoutes, setExploreRoutes] = useState([]); // State to hold explore routes
  const [userRoutes, setUserRoutes] = useState([]); // State to hold user routes
  const [isCreateMode, setIsCreateMode] = useState(false); // Track if showing user-created routes
  const [isFormPanelVisible, setIsFormPanelVisible] = useState(false); // Track form panel visibility
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [createMapName, setCreateMapName] = useState(""); // Track map name
  const [createMapWaypointIndex, setCreateMapWaypointIndex] = useState(0); // Track waypoint index for create mode
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null);
  const [highlightedRouteIndex, setHighlightedRouteIndex] = useState(null); // State for highlighting routes

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const fetchedExploreRoutes = await getRoutes(); // Await the async function
      setExploreRoutes(fetchedExploreRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleExplore = () => {
    setCurrentRouteIndex(Math.floor(Math.random() * exploreRoutes.length));
    setIsGlobalView(false);
  };

  const handleHoverRoute = (index) => {
    if (map && exploreRoutes[index]) {
      const route = exploreRoutes[index];
      const center = route.waypoints.length ? [route.waypoints[0].longitude, route.waypoints[0].latitude] : [0, 0];

      resetHighlightedMarkers();

      const markerElement = document.createElement("div");
      markerElement.className = "highlighted-marker-box";
      markerElement.innerHTML = `<div class="marker-title-box">${route.title}</div>`;

      const newMarker = new window.mapboxgl.Marker({
        element: markerElement,
        offset: [0, -30] // Offset to position above the waypoint
      })
        .setLngLat(center)
        .addTo(map);

      highlightedMarkersRef.current.push(newMarker);
    }
  };

  const handleLeaveRoute = () => {
    resetHighlightedMarkers();
  };

  const handleSelectRoute = (index) => {
    setCurrentRouteIndex(index);
    setIsGlobalView(false);
  };

  const handleLogin = async (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    // Fetch routes immediately after logging in
    await fetchRoutes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const setGoToTopLevelView = (goToGlobalView) => {
    goToTopLevelViewRef.current = goToGlobalView;
  };

  // Function to toggle the view state
  const toggleGlobalView = (isGlobal) => {
    setIsGlobalView(isGlobal);
  };

  // Function to switch to create mode and open the form panel
  const handleSwitchToCreateMode = (createMapName) => {
    setCreateMapName(createMapName); // Set the map name
    setIsCreateMode(true);
    setIsFormPanelVisible(true); // Show the form panel
    setShowBackToExploreButton(true); // Show "Back to Explore" button
    setSelectedWaypoint(null);

    // Create a new route with the given map name, empty description, and empty waypoints
    setUserRoutes([{
      title: createMapName,
      description: "",
      duration: "",
      waypoints: []
    }]);
  };

  const resetHighlightedMarkers = () => {
    highlightedMarkersRef.current.forEach(marker => marker.remove());
    highlightedMarkersRef.current = [];
  };

  // Function to add a waypoint to their route
  const addWaypointToUserRoutes = () => {
    setCreateMapWaypointIndex((prevIndex) => prevIndex + 1);
  };

  // Function to update a waypoint in the first route (index 0) by waypoint index
  const handleUpdateWaypoint = (waypoint) => {
    setUserRoutes((prevRoutes) => {
      const updatedRoutes = [...prevRoutes];
      if (createMapWaypointIndex === updatedRoutes[0].waypoints.length) {
        updatedRoutes[0].waypoints.push(waypoint);
      } else if (updatedRoutes.length >= -1 && updatedRoutes[0].waypoints.length > createMapWaypointIndex) {
        const route = updatedRoutes[0];
        
        // Update the waypoint at the given createMapWaypointIndex
        route.waypoints[createMapWaypointIndex] = waypoint;

        updatedRoutes[0] = route;
        console.log(`Updated waypoint at index ${createMapWaypointIndex}:`, waypoint);
      } else {
        console.error("Invalid index or route for updating waypoint.");
      }
      console.log("Updated Routes after adding waypoint:", updatedRoutes);
      return updatedRoutes;
    });
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PATHLESS_BASE_URL}maps/create_with_waypoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userRoutes[0]), // Send the entire route object
      });
  
      if (!response.ok) {
        throw new Error('Failed to create map and waypoints');
      }
  
      alert('Map and waypoints published successfully!');
      handleSwitchToExploreMode(); // Switch to explore mode after publishing
    } catch (error) {
      console.error('Error publishing map and waypoints:', error);
      alert('Failed to publish map and waypoints.');
    }
  };

  // Function to switch to explore mode and close the form panel
  const handleSwitchToExploreMode = () => {
    setCreateMapWaypointIndex();
    setIsCreateMode(false);
    setIsFormPanelVisible(false); // Close the form panel
    setSelectedWaypoint(null);
    setShowBackToExploreButton(false); // Hide "Back to Explore" button
    goToTopLevelViewRef.current && goToTopLevelViewRef.current(); // Go back to global view
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <>
            <Navbar
              onLogout={handleLogout}
              onHomeClick={() => goToTopLevelViewRef.current && goToTopLevelViewRef.current()}
              showHomeButton={!isGlobalView}
              onBackToExplore={handleSwitchToExploreMode}
              onBackToCreate={handleSwitchToCreateMode}
              isCreateMode={isCreateMode}
              createMapName={createMapName}
              onPublish={handlePublish}
              selectedWaypoint={selectedWaypoint}
              currentRoute={exploreRoutes[currentRouteIndex]}
              onExplore={handleExplore}
            />
            {!isCreateMode && isGlobalView && (
              <RouteOverviewPanel
                routes={exploreRoutes}
                onHoverRoute={index => handleHoverRoute(index)}
                onLeaveRoute={() => handleLeaveRoute()}
                onClickRoute={handleSelectRoute}
              />
            )}
          </>
        )}
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/map"
            element={
              isAuthenticated ? (
                <MapboxComponent
                  routes={isCreateMode ? userRoutes : exploreRoutes}
                  resetToTopLevelView={setGoToTopLevelView}
                  toggleGlobalView={toggleGlobalView}
                  isGlobalView={isGlobalView}
                  addWaypointToUserRoutes={addWaypointToUserRoutes}
                  isFormPanelVisible={isFormPanelVisible}
                  setIsFormPanelVisible={setIsFormPanelVisible}
                  isCreateMode={isCreateMode}
                  onUpdateWaypoint={handleUpdateWaypoint}
                  selectedWaypoint={selectedWaypoint}
                  setSelectedWaypoint={setSelectedWaypoint}
                  setCurrentRouteIndex={setCurrentRouteIndex}
                  currentRouteIndex={currentRouteIndex}
                  highlightedRouteIndex={highlightedRouteIndex} // Pass for map highlighting
                  handleHoverRoute={handleHoverRoute}
                  handleLeaveRoute={handleLeaveRoute}
                  mapContainerRef={mapContainerRef}
                  map={map}
                  setMap={setMap}
                  resetHighlightedMarkers={resetHighlightedMarkers}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/map" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
