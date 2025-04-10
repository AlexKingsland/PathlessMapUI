import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateMapModal from "../CreateMapModal";
import "../../css/user/UserProfile.css";

export default function UserProfile({ currentUser, setIsEditMode, handleSwitchToEditMode }) {
  const { alias } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PATHLESS_BASE_URL}/auth/user/${alias}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [alias]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>User not found.</p>;

  const handleViewMap = (mapId) => {
    localStorage.setItem("selectedRouteId", mapId);
    navigate("/map");
  };

  const handleEditMap = (mapId, e) => {
    e.stopPropagation();
    localStorage.setItem("selectedRouteId", mapId);
    const map = user.maps.find((m) => m.id === mapId);

    const parseDuration = (durationStr) => {
      const match = durationStr?.match(
        /(?:(\d+)\s*days?)?\s*,?\s*(?:(\d+)\s*hours?)?\s*,?\s*(?:(\d+)\s*minutes?)?/i
      );
      if (match) {
        return {
          days: parseInt(match[1] || "0", 10),
          hours: parseInt(match[2] || "0", 10),
          minutes: parseInt(match[3] || "0", 10),
        };
      }
      return { days: 0, hours: 0, minutes: 0 };
    };
    

    const parsedMap = {
      ...map,
      duration: typeof map.duration === "string" ? parseDuration(map.duration) : map.duration,
    };
    setSelectedMap(parsedMap);
    setIsEditModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="profile-container">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/map")}>← Back to Map</button>
      </div>

      <div className="profile-header">
        <img
          src={user.image_data?.startsWith("data:image/") ? user.image_data : "/default-avatar.png"}
          alt={user.name}
          className="profile-image"
        />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-bio">{user.bio || "No bio available."}</p>
      </div>

      <div className="profile-maps">
        <h3 className="section-title">Created Maps</h3>
        {user.maps.length === 0 ? (
          <p className="no-maps">No maps created yet.</p>
        ) : (
          <div className="maps-list">
            {user.maps.map((map) => (
              <div
                key={map.id}
                className="map-card group"
                onClick={() => handleViewMap(map.id)}
              >
                <img
                  src={
                    map.image_data
                      ? map.image_data.startsWith("data:image/")
                        ? map.image_data
                        : `data:image/jpeg;base64,${map.image_data}`
                      : "/placeholder.jpg"
                  }
                  alt={map.title}
                  className="map-image"
                />
                <div className="map-details">
                  <h4 className="map-title">{map.title}</h4>
                  <p className="map-description">{map.description || "No description available."}</p>
                  <p className="map-meta"><strong>Duration:</strong> {map.duration || "N/A"}</p>
                  <p className="map-meta"><strong>Rating:</strong> {map.rating !== 0 ? `${map.rating} ⭐` : "No ratings yet ⭐"}</p>
                  <p className="map-meta"><strong>Price:</strong> {map.price != null ? `$${map.price.toFixed(2)}` : "N/A"}</p>
                  <p className="map-meta"><strong>Countries:</strong> {map.countries?.length > 0 ? map.countries.join(", ") : "N/A"}</p>
                </div>

                {currentUser?.sub?.alias === alias && (
                  <button
                    className="edit-map-button"
                    onClick={(e) => handleEditMap(map.id, e)}
                  >
                    ✎ Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <CreateMapModal
          mode="edit"
          defaultValues={selectedMap}
          onEditMode={handleSwitchToEditMode}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMap(null);
          }}
        />
      )}
    </div>
  );
}
