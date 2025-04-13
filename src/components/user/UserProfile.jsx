import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateMapModal from "../CreateMapModal";
import EditUserProfile from "./EditUserProfile";
import "../../css/user/UserProfile.css";

export default function UserProfile({ currentUser, setIsEditMode, handleSwitchToEditMode, setCreateMapName }) {
  const { alias } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [mapToDelete, setMapToDelete] = useState(null);

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

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="pathless-spinner"></div>
        <p style={{ marginLeft: "15px", color: "#8b5e3c", fontWeight: "bold" }}>Fetching maps...</p>
      </div>
    );
  }  
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>User not found.</p>;

  const handleViewMap = (mapId) => {
    localStorage.setItem("selectedRouteId", mapId);
    navigate("/map");
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    console.log("isEditingProfile", isEditingProfile);
   }

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
    setCreateMapName(map.title);
  };

  const refreshUserProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PATHLESS_BASE_URL}/auth/user/${alias}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error refreshing user profile:", err);
    }
  };

  const handleDeleteMap = async () => {
    if (!mapToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_PATHLESS_BASE_URL}/maps/${mapToDelete}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete map");
      setMapToDelete(null);
      refreshUserProfile();
    } catch (err) {
      console.error("Error deleting map:", err);
    }
  };

  return (
    <div className="profile-container">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/map")}>← Back to Map</button>
      </div>

      <div className="profile-header">
        {currentUser?.sub?.alias === alias && (
          <button
            className="edit-profile-button"
            onClick={handleEditProfile}
          >
            ✎ Edit Profile
          </button>
        )}
        <img
          src={
            user.image_data
              ? user.image_data.startsWith("data:image/")
                ? user.image_data
                : `data:image/jpeg;base64,${user.image_data}`
              : "/default-avatar.png"
          }
          alt={user.name}
          className="profile-image"
        />

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-bio">{user.bio || "No bio available."}</p>
      </div>

      <div className="profile-maps">
      <h3 className="section-title">Created Maps</h3>
        {Array.isArray(user?.maps) && user.maps.length === 0 ? (
          <p className="no-maps">No maps created yet.</p>
        ) : Array.isArray(user?.maps) ? (
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
                  <div className="map-buttons">
                  <button
                    className="edit-map-button"
                    onClick={(e) => handleEditMap(map.id, e)}
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="delete-map-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapToDelete(map.id);
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-maps">Loading map data...</p>
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

      {isEditingProfile && (
        <EditUserProfile
          user={user}
          onClose={() => setIsEditingProfile(false)}
          refreshUserProfile={refreshUserProfile}
        />
      )}

      {mapToDelete && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <p>Are you sure you want to delete this map?</p>
            <div className="delete-confirm-buttons">
              <button className="confirm-delete" onClick={handleDeleteMap}>Yes</button>
              <button className="cancel-delete" onClick={() => setMapToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
