import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/auth/RegisterPage.css"; // Import the CSS file for styling

const baseURL = process.env.REACT_APP_PATHLESS_BASE_URL;

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents form from reloading the page

    try {
      await axios.post(`${baseURL}/auth/register`, {
        email,
        password,
        role,
        name,
        bio,
      });
      setError(""); // Clear any previous errors
      navigate("/login"); // Redirect to login page only after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="register-input"
          >
            <option value="traveler">Traveler</option>
            <option value="creator">Creator</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="register-input register-textarea"
          ></textarea>
          <button type="submit" className="register-button">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
