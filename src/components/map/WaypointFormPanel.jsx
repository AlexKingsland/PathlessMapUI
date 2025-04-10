import React, { useState, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import "../../css/map/WaypointFormPanel.css";

const libraries = ["places"];

const WaypointFormPanel = ({ onAddWaypoint, onUpdateWaypoint, isPanelOpen, togglePanel, setSelectedWaypoint, selectedWaypoint, userRoutes }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentWaypoint, setCurrentWaypoint] = useState({
    title: "",
    description: "",
    info: "",
    latitude: "",
    longitude: "",
    tags: "",
    price: "",
    image: null
  });

  const [useGoogleSearch, setUseGoogleSearch] = useState(true);
  const [address, setAddress] = useState("");
  const [isPlotted, setIsPlotted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    console.log("selectedWaypoint updated:", selectedWaypoint);
    if (selectedWaypoint) {
      setUseGoogleSearch(false);
      setCurrentWaypoint({
        title: selectedWaypoint.title || "",
        description: selectedWaypoint.description || "",
        info: selectedWaypoint.info || "",
        latitude: selectedWaypoint.latitude ?? "",
        longitude: selectedWaypoint.longitude ?? "",
        tags: Array.isArray(selectedWaypoint.tags) ? selectedWaypoint.tags.join(", ") : selectedWaypoint.tags || "",
        price: selectedWaypoint.price ?? "",
        image: null,
        image_data: selectedWaypoint.image_data || null
      });
      setImagePreview(
        typeof selectedWaypoint.image_data === "string"
          ? selectedWaypoint.image_data.startsWith("data:image/")
            ? selectedWaypoint.image_data
            : `data:image/jpeg;base64,${selectedWaypoint.image_data}`
          : null
      );
      setIsPlotted(true);
    }
  }, [selectedWaypoint]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWaypoint((prev) => ({
      ...prev,
      [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2048 * 2048) {
        setImageError("File size must be less than 1MB.");
        setImagePreview(null);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setImageError("Invalid file type. Only JPEG and PNG are allowed.");
        setImagePreview(null);
        return;
      }

      setImageError("");
      setCurrentWaypoint((prev) => ({
        ...prev,
        image_data: file
      }));

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelect = async (value) => {
    setAddress(value);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          setCurrentWaypoint((prev) => ({
            ...prev,
            latitude: location.lat(),
            longitude: location.lng(),
            title: value.split(",")[0]
          }));
        } else {
          console.error("Geocode was not successful:", status);
        }
      });
    } catch (error) {
      console.error("Error with Places Autocomplete:", error);
    }
  };

  const handleAddWaypoint = () => {
    onAddWaypoint();
    // setSelectedWaypoint(null); // clear selection so form resets
    setCurrentWaypoint({
      title: "",
      description: "",
      info: "",
      latitude: "",
      longitude: "",
      tags: "",
      price: "",
      image: null
    });
    setAddress("");
    setIsPlotted(false);
    setImagePreview(null);
  };

  const handleUpdateWaypoint = () => {
    console.log("Current Waypoint being updated:", currentWaypoint);
    onUpdateWaypoint({
      ...currentWaypoint,
      latitude: parseFloat(currentWaypoint.latitude),
      longitude: parseFloat(currentWaypoint.longitude),
      price: parseFloat(currentWaypoint.price)
    });
    setIsPlotted(true);
  };

  const handleToggleInputMode = () => {
    setUseGoogleSearch((prev) => !prev);
  };

  const isPlotButtonDisabled = !currentWaypoint.latitude || !currentWaypoint.longitude;

  return (
    <div>
      <div>
        <div className={`waypoint-form-panel ${isPanelOpen ? 'open' : 'closed'}`}>
          <h3>Add Waypoint</h3>
          <button className="full-width-button" onClick={handleToggleInputMode}>
            {useGoogleSearch ? "Manual Input" : "Google Maps Input"}
          </button>

          {useGoogleSearch ? (
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Search for a location",
                      className: "google-maps-search-input"
                    })}
                  />
                  <div className="autocomplete-dropdown">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const style = {
                        backgroundColor: suggestion.active ? "#f0f0f0" : "#ffffff",
                        cursor: "pointer",
                        padding: "10px",
                        borderBottom: "1px solid #ddd"
                      };
                      return (
                        <div {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          ) : (
            <div>
              <input
                type="text"
                name="title"
                placeholder="Waypoint Title"
                value={currentWaypoint.title}
                onChange={handleChange}
              />
              <div className="lat-lon-container">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={currentWaypoint.latitude}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={currentWaypoint.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={currentWaypoint.description}
              onChange={handleChange}
            />
            <textarea
              name="info"
              placeholder="Additional Info"
              value={currentWaypoint.info}
              onChange={handleChange}
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={currentWaypoint.tags}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              step="0.01"
              value={currentWaypoint.price}
              onChange={handleChange}
            />
          </div>

          <div className="image-upload-section">
            <label>Upload Image (Max 2MB)</label>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
            {imageError && <p className="error-text">{imageError}</p>}

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Waypoint Preview" style={{ maxWidth: "100%", height: "auto" }} />
              </div>
            )}
          </div>

          <div className="button-group">
            <button onClick={handleUpdateWaypoint} disabled={isPlotButtonDisabled}>
              Plot
            </button>
            <button onClick={handleAddWaypoint} disabled={!isPlotted}>
              Next
            </button>
          </div>
        </div>
        <div className="toggle-tab" onClick={togglePanel}>
          {!isPanelOpen ? "❮" : "❯"}
        </div>
      </div>
    </div>
  );
};

export default WaypointFormPanel;
