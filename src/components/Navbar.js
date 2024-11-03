import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar({ onLogout, onHomeClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-button" onClick={onHomeClick}>Globe</button> {/* Calls onHomeClick */}
        <button className="navbar-button" onClick={() => navigate("/profile")}>Profile</button>
        <button className="navbar-button" onClick={() => navigate("/filters")}>Filters</button>
      </div>
      <div className="navbar-right">
        <button className="navbar-button logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
