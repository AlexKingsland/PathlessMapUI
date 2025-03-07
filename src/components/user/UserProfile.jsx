import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/user/UserProfile.css";

const UserProfile = () => {
  const { alias } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      <div className="profile-header">
        <img
          src={user.image || "/default-avatar.png"}
          alt={user.name}
          className="profile-image"
        />
        <h2>{user.name}</h2>
        <p className="profile-bio">{user.bio}</p>
      </div>

      <div className="profile-maps">
        <h3>Created Maps</h3>
        {user && user.maps && user.maps.length === 0 ? (
          <p>No maps created yet.</p>
        ) : (
        <div className="maps-list">
            {user?.maps?.map((map) => (
            <div key={map.id} className="map-card">
                <img src={map.image_data || "/placeholder.jpg"} alt={map.title} />
                <h4>{map.title}</h4>
            </div>
            ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
