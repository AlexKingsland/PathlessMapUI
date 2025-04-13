import React, { useState } from "react";
import "../../css/user/EditUserProfile.css";

const EditUserProfile = ({ user, onClose, refreshUserProfile }) => {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [alias, setAlias] = useState(user.alias || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(
    user.image_data
      ? user.image_data.startsWith("data:image/")
        ? user.image_data
        : `data:image/jpeg;base64,${user.image_data}`
      : null
  );
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("alias", alias);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PATHLESS_BASE_URL}auth/user/${user.id}/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      await refreshUserProfile(); // refresh user profile
      onClose(); // close modal
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message);
    }
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Alias</label>
          <input type="text" name="alias" value={alias} onChange={(e) => setAlias(e.target.value)} required />

          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="profile-preview" />}

          {error && <p className="error">{error}</p>}
          <button type="submit" className="update-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfile;
