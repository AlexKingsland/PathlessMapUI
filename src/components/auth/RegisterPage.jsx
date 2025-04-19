import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/auth/AuthPage.css";

const baseURL = import.meta.env.VITE_PATHLESS_BASE_URL;

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents form from reloading the page

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("alias", alias);
    if (image) {
      formData.append("profile_image", image);
    }

    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }
  
      setError("");
      navigate("/login"); // Redirect to login page only after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        setImage(null);
        setImagePreview(null); // Clear preview on error
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setImageError("Invalid file type. Only JPEG and PNG are allowed.");
        setImage(null);
        setImagePreview(null); // Clear preview on error
        return;
      }

      setImageError("");
      setImage(file);

      // Create a file reader to generate the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Become a Pathless User!</h2>
        <form onSubmit={handleSubmit}>
          <div className="image-upload">
            <input
              type="file"
              id="profile-image"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              style={{ display: "none" }} // Hide default input
            />
            <label htmlFor="profile-image" className="custom-file-button">
              {imagePreview ? "Change Profile Picture" : "Upload Profile Picture"}
            </label>

            {imageError && <p className="error-text">{imageError}</p>}

            {/* Display the image preview if available */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
          />
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
          <input
            type="text"
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
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
