import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateMapModal.css";

const CreateMapModal = ({ onClose, onCreateMode, onEditMode, mode, defaultValues = {} }) => {

  const formatImageData = (img) => {
    if (!img) return null;
    return img.startsWith("data:image/") ? img : `data:image/jpeg;base64,${img}`;
  };
  
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [mapDuration, setMapDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const [mapImage, setMapImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setMapName(defaultValues.title || "");
      setMapDescription(defaultValues.description || "");
      setMapDuration(defaultValues.duration || { days: 0, hours: 0, minutes: 0 });
      const parsedImage = formatImageData(defaultValues.image_data);
      setImagePreview(parsedImage);
    }
  }, [defaultValues, mode]);

  const isFormValid =
    mapName.trim() &&
    mapDescription.trim() &&
    mapDuration.days >= 0 &&
    mapDuration.hours >= 0 &&
    mapDuration.minutes >= 0 &&
    (mapImage || imagePreview);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        setMapImage(null);
        setImagePreview(null); // Clear preview on error
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setImageError("Invalid file type. Only JPEG and PNG are allowed.");
        setMapImage(null);
        setImagePreview(null); // Clear preview on error
        return;
      }

      setImageError("");
      setMapImage(file);

      // Create a file reader to generate the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      if (mode === "edit") {
        const newMapMetadata = {
          mapId: defaultValues.id,
          mapName,
          mapDescription,
          mapDuration,
          mapImage: mapImage || imagePreview,
        };
        onEditMode(newMapMetadata);
        navigate("/map");
      } else {
        onCreateMode(mapName, mapDescription, mapDuration, mapImage || imagePreview); // Call onCreateMode
      }
      onClose(); // Close the modal
    }
  };

  const handleDurationChange = (field, value) => {
    setMapDuration((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit} className="create-map-form">
          <h2 className="modal-title">{mode === "edit" ? "Edit Map" : "Create Map"}</h2>

          <label className="form-label">Map Name:</label>
          <input
            type="text"
            placeholder="Enter Map Name"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className="map-name-input"
            required
          />

          <label className="form-label">Description:</label>
          <textarea
            placeholder="Enter Map Description"
            value={mapDescription}
            onChange={(e) => setMapDescription(e.target.value)}
            className="map-description-input"
            required
          />

          <label className="form-label">Duration:</label>
          <div className="duration-inputs">
            <div className="duration-input-group">
              <label>Days:</label>
              <input
                type="number"
                min="0"
                value={mapDuration.days}
                onChange={(e) => handleDurationChange("days", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="duration-input-group">
              <label>Hours:</label>
              <input
                type="number"
                min="0"
                max="23"
                value={mapDuration.hours}
                onChange={(e) => handleDurationChange("hours", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            {/* <div className="duration-input-group">
              <label>Minutes:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={mapDuration.minutes}
                onChange={(e) => handleDurationChange("minutes", parseInt(e.target.value) || 0)}
                required
              />
            </div> */}
          </div>

          <label className="form-label">Upload Image:</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image*"
              onChange={handleImageChange}
              required={!imagePreview}
            />
            {imageError && <p className="error-text">{imageError}</p>}

            {/* Display the image preview if available */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-map-button ${!isFormValid ? "disabled" : ""}`}
            disabled={!isFormValid}
          >
            {mode === "edit" ? "Edit Destinations" : "Enter Destinations"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMapModal;
