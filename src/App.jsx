import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MapboxComponent from "./components/map/MapboxComponent";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Navbar from "./components/Navbar";
import { getRoutes } from "./waypoints"; // Import getRoutes function

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isGlobalView, setIsGlobalView] = useState(true); // Track global vs. zoomed-in view
  const [showBackToExploreButton, setShowBackToExploreButton] = useState(false); // Track if "Back to Explore" button is shown
  const goToTopLevelViewRef = useRef(null);
  const [exploreRoutes, setExploreRoutes] = useState([]); // State to hold explore routes
  const [userRoutes, setUserRoutes] = useState([]); // State to hold user routes
  const [isCreateMode, setIsCreateMode] = useState(false); // Track if showing user-created routes
  const [isFormPanelVisible, setIsFormPanelVisible] = useState(false); // Track form panel visibility
  const [createMapName, setCreateMapName] = useState(""); // Track map name

  useEffect(() => {
    // Simulate fetching explore routes using getRoutes (mock data)
    const fetchedExploreRoutes = getRoutes();
    setExploreRoutes(fetchedExploreRoutes);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
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

  // Function to add a waypoint to userRoutes
  const addWaypointToUserRoutes = (newWaypoint) => {
    setUserRoutes((prevUserRoutes) => {
      const updatedUserRoutes = [...prevUserRoutes];
      if (updatedUserRoutes.length > 0) {
        updatedUserRoutes[0].waypoints.push(newWaypoint);
      } else {
        updatedUserRoutes.push({ waypoints: [newWaypoint] });
      }
      return updatedUserRoutes;
    });
  };

  // Function to switch to create mode and open the form panel
  const handleSwitchToCreateMode = (createMapName) => {
    console.log("handleSwitchToCreateMode called with map name:", createMapName);
    setCreateMapName(createMapName); // Set the map name
    setIsCreateMode(true);
    setIsFormPanelVisible(true); // Show the form panel
    setShowBackToExploreButton(true); // Show "Back to Explore" button
  };

  // Function to switch to explore mode and close the form panel
  const handleSwitchToExploreMode = () => {
    setIsCreateMode(false);
    setIsFormPanelVisible(false); // Close the form panel
    setShowBackToExploreButton(false); // Hide "Back to Explore" button
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <>
            <Navbar
              onLogout={handleLogout}
              onHomeClick={() => goToTopLevelViewRef.current && goToTopLevelViewRef.current()}
              showHomeButton={!isGlobalView} // Pass true only when zoomed in
              onBackToExplore={handleSwitchToExploreMode} // Pass the function to switch to explore mode
              onBackToCreate={handleSwitchToCreateMode} // Pass the function to switch to create mode
              isCreateMode={isCreateMode}
              createMapName={createMapName} // Pass the map name to Navbar
            />
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
                  routes={isCreateMode ? userRoutes : exploreRoutes} // Switch between user and explore routes
                  resetToTopLevelView={setGoToTopLevelView}
                  toggleGlobalView={toggleGlobalView} // Pass down the toggle function
                  addWaypointToUserRoutes={addWaypointToUserRoutes} // Pass the function to add waypoints
                  isFormPanelVisible={isFormPanelVisible} // Pass form panel visibility state
                  setIsFormPanelVisible={setIsFormPanelVisible} // Pass setter for form panel visibility
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
