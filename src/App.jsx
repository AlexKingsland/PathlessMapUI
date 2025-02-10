import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MapboxComponent from "./components/map/MapboxComponent";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import RouteOverviewPanel from "./components/RouteOverviewPanel";
import Navbar from "./components/Navbar";
import { getRoutes } from "./waypoints";
import { jwtDecode } from "jwt-decode";

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
  const [waypointFormPanelVisible, setWaypointFormPanelVisible] = useState(false); // Track form panel visibility
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [createMapName, setCreateMapName] = useState(""); // Track map name
  const [createMapWaypointIndex, setCreateMapWaypointIndex] = useState(0); // Track waypoint index for create mode
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null);
  const [highlightedRouteIndex, setHighlightedRouteIndex] = useState(null); // State for highlighting routes
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(true);
  const [isCreateMapModalVisible, setIsCreateMapModalVisible] = useState(false);
  const markerRefs = useRef({});

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

    // Check token expiration on app load
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp < currentTime) {
        // Token is expired
        handleLogout();
      } else {
        // Set a timeout to log the user out when the token expires
        const timeToExpire = decodedToken.exp * 1000 - Date.now();
        const timeout = setTimeout(() => {
          handleLogout();
        }, timeToExpire);

        return () => clearTimeout(timeout); // Clear timeout on component unmount
      }
    }
  };

  const handleExplore = () => {
    setCurrentRouteIndex(Math.floor(Math.random() * exploreRoutes.length));
    setIsGlobalView(false);
    setSelectedWaypoint(null);
  };

  const toggleWaypointFormPanel = () => {
    setWaypointFormPanelVisible(!waypointFormPanelVisible);
  };

  const toggleRoutePanel = () => {
    setIsRoutePanelOpen((prevState) => !prevState);
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
  const handleSwitchToCreateMode = (createMapName, mapDescription, mapDuration, mapImage) => {
    setCreateMapName(createMapName); // Set the map name
    setIsCreateMode(true);
    setWaypointFormPanelVisible(true); // Show the form panel
    setShowBackToExploreButton(true); // Show "Back to Explore" button
    setSelectedWaypoint(null);
    setIsCreateMapModalVisible(false);

    // Create a new route with the given map name, empty description, and empty waypoints
    setUserRoutes([{
      title: createMapName,
      description: mapDescription,
      duration: mapDuration,
      map_image: mapImage,
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
        console.error("Invalid index or route for updating waypoint.", createMapWaypointIndex);
      }
      console.log("Updated Routes after adding waypoint:", updatedRoutes);
      return updatedRoutes;
    });
  };

  const handlePublish = async () => {
    try {
      const route = userRoutes[0];
  
      // Create FormData to send the route and image data
      const formData = new FormData();
  
      // Append basic route information
      formData.append("title", route.title);
      formData.append("description", route.description || "");
      formData.append(
        "duration",
        `${route.duration.days || 0} days ${route.duration.hours || 0} hours ${route.duration.minutes || 0} minutes` // Properly format duration
      );
      formData.append("tags", JSON.stringify(route.tags || []));
      formData.append("price", route.price || 0.0);
  
      // Append route image (if available)
      if (route.map_image) {
        formData.append("map_image", route.map_image);
      }
  
      // Append waypoints
      formData.append(
        "waypoints",
        JSON.stringify(
          route.waypoints.map((waypoint) => ({
            title: waypoint.title,
            description: waypoint.description || "",
            info: waypoint.info || "",
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            tags: waypoint.tags || [],
            price: waypoint.price || 0.0,
            times_of_day: waypoint.times_of_day || null,
          }))
        )
      );
  
      // Append waypoint images (if available)
      route.waypoints.forEach((waypoint, index) => {
        if (waypoint.image_data) {
          formData.append(`waypoint_image_${index}`, waypoint.image_data);
        }
      });
  
      // Send the FormData to the backend
      const response = await fetch(
        `${import.meta.env.VITE_PATHLESS_BASE_URL}maps/create_with_waypoints`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create map and waypoints");
      }
  
      alert("Map and waypoints published successfully!");
      handleSwitchToExploreMode(); // Switch to explore mode after publishing
    } catch (error) {
      console.error("Error publishing map and waypoints:", error);
      alert("Failed to publish map and waypoints.");
    }
  
    fetchRoutes(); // Fetch the updated routes after publishing
  };
  

  // Function to switch to explore mode and close the form panel
  const handleSwitchToExploreMode = () => {
    setCreateMapWaypointIndex(0);
    setIsCreateMode(false);
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
              showHomeButton={!isGlobalView}
              onBackToExplore={handleSwitchToExploreMode}
              onBackToCreate={handleSwitchToCreateMode}
              isCreateMode={isCreateMode}
              createMapName={createMapName}
              onPublish={handlePublish}
              currentRoute={exploreRoutes[currentRouteIndex]}
              onExplore={handleExplore}
              userRoutes={userRoutes}
            />
            {!isCreateMode && isGlobalView && (
              <RouteOverviewPanel
                routes={exploreRoutes}
                onHoverRoute={index => handleHoverRoute(index)}
                onLeaveRoute={() => handleLeaveRoute()}
                onClickRoute={handleSelectRoute}
                markerRefs={markerRefs}
                isPanelOpen={isRoutePanelOpen}
                togglePanel={toggleRoutePanel}
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
                  waypointFormPanelVisible={waypointFormPanelVisible}
                  toggleWaypointFormPanel={toggleWaypointFormPanel}
                  isCreateMode={isCreateMode}
                  onUpdateWaypoint={handleUpdateWaypoint}
                  selectedWaypoint={selectedWaypoint}
                  setSelectedWaypoint={setSelectedWaypoint}
                  setCurrentRouteIndex={setCurrentRouteIndex}
                  currentRouteIndex={currentRouteIndex}
                  highlightedRouteIndex={highlightedRouteIndex}
                  handleHoverRoute={handleHoverRoute}
                  handleLeaveRoute={handleLeaveRoute}
                  mapContainerRef={mapContainerRef}
                  map={map}
                  setMap={setMap}
                  resetHighlightedMarkers={resetHighlightedMarkers}
                  markerRefs={markerRefs}
                  isCreateMapModalVisible={isCreateMapModalVisible}
                  setIsCreateMapModalVisible={setIsCreateMapModalVisible}
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
