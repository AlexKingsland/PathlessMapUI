import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/user/UserProfile.css";

const UserProfile = () => {
  const { alias } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching:", `${import.meta.env.VITE_PATHLESS_BASE_URL}/auth/user/${alias}`);
  
    fetch(`${import.meta.env.VITE_PATHLESS_BASE_URL}/auth/user/${alias}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("User Data:", data);
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [alias]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="profile-container">
      {/* Back to Map Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/map")}>
          ← Back to Map
        </button>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={user.image_data || "/default-avatar.png"}
          alt={user.name}
          className="profile-image"
        />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-bio">{user.bio || "No bio available."}</p>
      </div>

      {/* Created Maps Section */}
      <div className="profile-maps">
        <h3 className="section-title">Created Maps</h3>
        {user.maps.length === 0 ? (
          <p className="no-maps">No maps created yet.</p>
        ) : (
          <div className="maps-list">
            {user.maps.map((map) => (
              <div key={map.id} className="map-card">
                <img src={map.image_data || "/placeholder.jpg"} alt={map.title} className="map-image"/>
                <div className="map-details">
                  <h4 className="map-title">{map.title}</h4>
                  <p className="map-description">{map.description || "No description available."}</p>
                  <p className="map-meta"><strong>Duration:</strong> {map.duration || "N/A"}</p>
                  <p className="map-meta"><strong>Rating:</strong> {map.rating !== 0 ? `${map.rating} ⭐` : "No ratings yet ⭐"}</p>
                  <p className="map-meta"><strong>Price:</strong> {map.price != null ? `$${map.price.toFixed(2)}` : "N/A"}</p>
                  <p className="map-meta"><strong>Countries:</strong> {map.countries?.length > 0 ? map.countries.join(", ") : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
