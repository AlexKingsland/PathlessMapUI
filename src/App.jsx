import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import MapboxComponent from "./components/map/MapboxComponent";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import RouteOverviewPanel from "./components/RouteOverviewPanel";
import WaypointOverviewPanel from "./components/map/WaypointOverviewPanel";
import UserProfile from "./components/user/UserProfile";
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
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
  const [waypointFormPanelVisible, setWaypointFormPanelVisible] = useState(false); // Track form panel visibility
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [createMapName, setCreateMapName] = useState(""); // Track map name
  const [createMapWaypointIndex, setCreateMapWaypointIndex] = useState(0); // Track waypoint index for create mode
  const [currentRouteIndex, setCurrentRouteIndex] = useState(null);
  const [highlightedRouteIndex, setHighlightedRouteIndex] = useState(null); // State for highlighting routes
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(true);
  const [isWaypointPanelOpen, setIsRouteWaypointPanelOpen] = useState(true);
  const [isCreateMapModalVisible, setIsCreateMapModalVisible] = useState(false);
  const [currentlyShowingFilteredDownMaps, setCurrentlyShowingFilteredDownMaps] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const markerRefs = useRef({});
  const waypointMarkerRefs = useRef({});

  //const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async (filters = {}) => {
    try {
      const fetchedExploreRoutes = await getRoutes(filters); // Await the async function
      setExploreRoutes(fetchedExploreRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }

    // Check token expiration on app load
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
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

  const toggleWaypointPanel = () => {
    setIsRouteWaypointPanelOpen((prevState) => !prevState);
  };

  const handleHoverRoute = (index) => {
    if (map && exploreRoutes[index]) {
      const route = exploreRoutes[index];
      // Calculate the center of the route
      const total = route.waypoints.reduce(
        (acc, wp) => {
          acc.lat += wp.latitude;
          acc.lon += wp.longitude;
          return acc;
        },
        { lat: 0, lon: 0 }
      );
      console.log("Total:", total);
      console.log("route.waypoints.length:", route.waypoints.length);
      const center = [total.lon / route.waypoints.length, total.lat / route.waypoints.length];
      console.log("Center:", center);

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

  const handleHoverWaypoint = (index) => {
    if (map && exploreRoutes[currentRouteIndex]?.waypoints[index]) {
      const waypoint = exploreRoutes[currentRouteIndex].waypoints[index];
  
      resetHighlightedMarkers();
  
      const markerElement = document.createElement("div");
      markerElement.className = "highlighted-marker-box";
      markerElement.innerHTML = `<div class="marker-title-box">${waypoint.title}</div>`;
  
      const newMarker = new window.mapboxgl.Marker({
        element: markerElement,
        offset: [0, -30], // Offset to position above the waypoint
      })
        .setLngLat([waypoint.longitude, waypoint.latitude])
        .addTo(map);
  
      highlightedMarkersRef.current.push(newMarker);
    }
  };
  
  const handleLeaveWaypoint = () => {
    resetHighlightedMarkers();
  };
  
  const handleSelectWaypoint = (index) => {
    let waypoint = null;
    if (isCreateMode) {
      waypoint = userRoutes[0].waypoints[index];
    } else {
      waypoint = exploreRoutes[currentRouteIndex].waypoints[index];
    }
    
    setSelectedWaypoint(waypoint);

    // Optionally zoom into the selected waypoint
    if (map) {
      map.flyTo({
        center: [waypoint.longitude, waypoint.latitude],
        zoom: 14,
        essential: true,
      });
    }
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
    setCreateMapName(createMapName);
    setIsCreateMode(true);
    setWaypointFormPanelVisible(true);
    setShowBackToExploreButton(true);
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

  const handleSwitchToEditMode = (newMapMetadata) => {
    setIsCreateMode(true);
    setWaypointFormPanelVisible(true);
    setShowBackToExploreButton(true);
    setSelectedWaypoint(null);
    setIsCreateMapModalVisible(false);

    const matchingIndex = exploreRoutes.findIndex((route) => route.id === parseInt(newMapMetadata.mapId));
    const matchingRoute = exploreRoutes[matchingIndex];
    console.log("newMapMetadata: ", newMapMetadata);
    console.log("map id: ", newMapMetadata.mapId);
    console.log("exploreRoutes: ", exploreRoutes);
    // Update the route with the new metadata
    const updatedRoute = {
      ...matchingRoute,
      title: newMapMetadata.mapName,
      description: newMapMetadata.mapDescription,
      duration: newMapMetadata.mapDuration,
      map_image: newMapMetadata.mapImage,
    };
    // Set the route to be edited (this already has its waypoints)
    setUserRoutes([updatedRoute]);
    console.log("User Routes: ", userRoutes);
  };
  

  const resetHighlightedMarkers = () => {
    highlightedMarkersRef.current.forEach(marker => marker.remove());
    highlightedMarkersRef.current = [];
  };

  // Function to update a waypoint in the first route (index 0) by waypoint index
  const handleUpdateWaypoint = (waypoint) => {
    setUserRoutes((prevRoutes) => {
      const updatedRoutes = [...prevRoutes];
      if (createMapWaypointIndex === updatedRoutes[0].waypoints.length) {
        updatedRoutes[0].waypoints.push(waypoint);
      } else if (updatedRoutes.length >= -1 && updatedRoutes[0].waypoints.length > createMapWaypointIndex) {
        const route = updatedRoutes[0];
        
        // Insert at createMapWaypointIndex, shifting existing ones forward
        route.waypoints.splice(createMapWaypointIndex, 0, waypoint);

        updatedRoutes[0] = route;
        console.log(`Updated waypoint at index ${createMapWaypointIndex}:`, waypoint);
      } else {
        console.error("Invalid index or route for updating waypoint.", createMapWaypointIndex);
      }
      console.log("Updated Routes after adding waypoint:", updatedRoutes);
      return updatedRoutes;
    });
  };

  function base64ToFile(base64, filename) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleSaveEdits = async () => {
    try {
      const route = userRoutes[0]; // Assuming single route in edit mode
      console.log("Saving edits for route:", route);
      const formData = new FormData();
  
      formData.append("title", route.title);
      formData.append("description", route.description || "");
      formData.append(
        "duration",
        `${route.duration.days || 0} days ${route.duration.hours || 0} hours ${route.duration.minutes || 0} minutes`
      );
      formData.append("tags", JSON.stringify(route.tags || []));
      formData.append("price", route.price || 0.0);
  
      // Append map image
      if (route.map_image) {
        formData.append("map_image", route.map_image);
      }
  
      // Append waypoints
      formData.append(
        "waypoints",
        JSON.stringify(
          route.waypoints.map((wp) => ({
            title: wp.title,
            description: wp.description || "",
            info: wp.info || "",
            latitude: wp.latitude,
            longitude: wp.longitude,
            tags: wp.tags || [],
            price: wp.price || 0.0,
            times_of_day: wp.times_of_day || null,
            duration: wp.duration || null,
            country: wp.country || null,
            city: wp.city || null,
            image_data:
              typeof wp.image_data === "string"
                ? wp.image_data
                : null,
          }))
        )
      );
  
      // Append waypoint images
      route.waypoints.forEach((wp, idx) => {
        if (wp.image_data) {
          formData.append(`waypoint_image_${idx}`, wp.image_data);
        }
      });
  
      const response = await fetch(
        `${import.meta.env.VITE_PATHLESS_BASE_URL}maps/${route.id}/update_with_waypoints`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update map and waypoints");
      }
  
      alert("Changes saved successfully!");
      handleSwitchToExploreMode(); // Optionally return to explore mode
    } catch (error) {
      console.error("Error saving edits:", error);
      alert("Failed to save map edits.");
    }
  
    fetchRoutes(); // Refresh data
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
            city: waypoint.city || null,
            country: waypoint.country || null,
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create map and waypoints");
      }
  
      alert("Map and waypoints published successfully!");
      handleSwitchToExploreMode();
    } catch (error) {
      console.error("Error publishing map and waypoints:", error);
      alert("Failed to publish map and waypoints.");
    }
  
    fetchRoutes(); // Fetch the updated routes after publishing
  };
  

  // Function to switch to explore mode and close the form panel
  const handleSwitchToExploreMode = (reloadAllMaps = false, myMapMode = false) => {
    if (!myMapMode) {
      setCreateMapWaypointIndex(0);
      setIsCreateMode(false);
      setIsEditMode(false);
      setSelectedWaypoint(null);
      setShowBackToExploreButton(false);
      setCurrentlyShowingFilteredDownMaps(false);
    }
    if (reloadAllMaps) {
      fetchRoutes();
    }
    goToTopLevelViewRef.current && goToTopLevelViewRef.current(); // Go back to global view
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user/:alias" element={<UserProfile currentUser={currentUser} setIsEditMode={setIsEditMode} handleSwitchToEditMode={handleSwitchToEditMode} setCreateMapName={setCreateMapName} fetchRoutes={fetchRoutes}/>} />
        <Route
          path="/map"
          element={
            isAuthenticated ? (
              <div>
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
                  fetchRoutes={fetchRoutes}
                  currentlyShowingFilteredDownMaps={currentlyShowingFilteredDownMaps}
                  setCurrentlyShowingFilteredDownMaps={setCurrentlyShowingFilteredDownMaps}
                  isEditMode={isEditMode}
                  onSaveEdits={handleSaveEdits}
                  currentUser={currentUser}
                />
                <MapboxComponent
                  routes={isCreateMode ? userRoutes : exploreRoutes}
                  resetToTopLevelView={setGoToTopLevelView}
                  toggleGlobalView={toggleGlobalView}
                  isGlobalView={isGlobalView}
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
                  handleHoverWaypoint={handleHoverWaypoint}
                  handleLeaveWaypoint={handleLeaveWaypoint}
                  mapContainerRef={mapContainerRef}
                  map={map}
                  setMap={setMap}
                  resetHighlightedMarkers={resetHighlightedMarkers}
                  markerRefs={markerRefs}
                  waypointMarkerRefs={waypointMarkerRefs}
                  isCreateMapModalVisible={isCreateMapModalVisible}
                  setIsCreateMapModalVisible={setIsCreateMapModalVisible}
                  setUserRoutes={setUserRoutes}
                  createMapWaypointIndex={createMapWaypointIndex}
                  setCreateMapWaypointIndex={setCreateMapWaypointIndex}
                  handleSelectRoute={handleSelectRoute}
                  handleSelectWaypoint={handleSelectWaypoint}
                />
                {!isCreateMode && (
                <>
                  {isGlobalView ? (
                    <RouteOverviewPanel
                      routes={exploreRoutes}
                      onHoverRoute={index => handleHoverRoute(index)}
                      onLeaveRoute={() => handleLeaveRoute()}
                      onClickRoute={handleSelectRoute}
                      markerRefs={markerRefs}
                      isPanelOpen={isRoutePanelOpen}
                      togglePanel={toggleRoutePanel}
                    />
                  ) : (
                    <WaypointOverviewPanel
                      route={exploreRoutes[currentRouteIndex]}
                      onHoverWaypoint={index => handleHoverWaypoint(index)}
                      onLeaveWaypoint={() => handleLeaveWaypoint()}
                      onClickWaypoint={handleSelectWaypoint}
                      waypointMarkerRefs={waypointMarkerRefs}
                      isPanelOpen={isWaypointPanelOpen}
                      togglePanel={toggleWaypointPanel}
                      setSelectedWaypoint={setSelectedWaypoint}
                    />
                  )}
                </>
              )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/map" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
