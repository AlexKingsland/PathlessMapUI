import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MapboxComponent from "./components/explorer/MapboxComponent";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const goToTopLevelViewRef = useRef(null);

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

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <Navbar
            onLogout={handleLogout}
            onHomeClick={() => goToTopLevelViewRef.current && goToTopLevelViewRef.current()}
          />
        )}
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/map"
            element={
              isAuthenticated ? (
                <MapboxComponent resetToTopLevelView={setGoToTopLevelView} />
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
