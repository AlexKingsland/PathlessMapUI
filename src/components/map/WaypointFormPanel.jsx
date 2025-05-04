import React, { useState, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import "../../css/map/WaypointFormPanel.css";

const libraries = ["places"];

const WaypointFormPanel = ({ onUpdateWaypoint, isPanelOpen, togglePanel, setSelectedWaypoint, selectedWaypoint, userRoutes, setUserRoutes, createMapWaypointIndex, setCreateMapWaypointIndex }) => {
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
    image: null,
    city: "",
    country: ""
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
        image_data: selectedWaypoint.image_data || null,
        city: selectedWaypoint.city || "",
        country: selectedWaypoint.country || ""
      });
      updateImagePreview(selectedWaypoint.image_data);
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
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size must be less than 5MB.");
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
          const components = results[0].address_components;
  
          let city = "";
          let country = "";

          console.log("Components:", components);
  
          components.forEach((component) => {
            // Prioritized city-level identifiers
            if (
              component.types.includes("locality") ||              // Most common for cities
              component.types.includes("administrative_area_level_2") || // County/district (fallback)
              component.types.includes("sublocality") ||           // Neighborhood
              component.types.includes("postal_town")              // Common in UK and some regions
            ) {
              if (!city) city = component.long_name;
            }
            if (component.types.includes("country")) {
              country = component.long_name;
            }
          });
  
          setCurrentWaypoint((prev) => ({
            ...prev,
            latitude: location.lat(),
            longitude: location.lng(),
            title: value.split(",")[0],
            city,
            country,
          }));
        } else {
          console.error("Geocode was not successful:", status);
        }
      });
    } catch (error) {
      console.error("Error with Places Autocomplete:", error);
    }
  };

  const handleSetNewWaypoint = () => {
    setUseGoogleSearch(true);
    setCreateMapWaypointIndex((prevIndex) => prevIndex + 1);
    setSelectedWaypoint(null);
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

  const updateImagePreview = (imageData) => {
    if (!imageData) {
      setImagePreview(null);
      return;
    }
  
    if (typeof imageData === "string") {
      setImagePreview(
        imageData.startsWith("data:image/")
          ? imageData
          : `data:image/jpeg;base64,${imageData}`
      );
    } else if (imageData instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageData);
    }
  }

  const handleUpdateWaypoint = () => {
    if (selectedWaypoint) {
      const updatedWaypoint = {
        ...selectedWaypoint,
        title: currentWaypoint.title,
        description: currentWaypoint.description,
        info: currentWaypoint.info,
        latitude: parseFloat(currentWaypoint.latitude),
        longitude: parseFloat(currentWaypoint.longitude),
        tags: Array.isArray(currentWaypoint.tags) ? currentWaypoint.tags.join(", ") : currentWaypoint.tags,
        price: parseFloat(currentWaypoint.price),
        image_data: currentWaypoint.image_data || selectedWaypoint.image_data
      };
      console.log("Old waypoints:", userRoutes[0].waypoints);
      const newWaypoints = userRoutes[0].waypoints.map((wp) =>
        wp.title === selectedWaypoint.title ? updatedWaypoint : wp
      );
      setUserRoutes([{
        ...userRoutes[0],
        waypoints: newWaypoints
      }]);
      console.log("Updated waypoints:", newWaypoints);
      setSelectedWaypoint(updatedWaypoint);
      setCurrentWaypoint(updatedWaypoint);
      updateImagePreview(updatedWaypoint.image_data);
      setIsPlotted(true);
    }
  };

  const handleAddWaypoint = () => {
    onUpdateWaypoint({
      ...currentWaypoint,
      latitude: parseFloat(currentWaypoint.latitude),
      longitude: parseFloat(currentWaypoint.longitude),
      price: parseFloat(currentWaypoint.price)
    });
    setIsPlotted(true);
    setSelectedWaypoint(userRoutes[0].waypoints[createMapWaypointIndex]);
  };

  const handleDeleteWaypoint = () => {
    if (selectedWaypoint) {
      const newWaypoints = userRoutes[0].waypoints.filter((wp) => wp.title !== selectedWaypoint.title);
      setUserRoutes([{
        ...userRoutes[0],
        waypoints: newWaypoints
      }]);
      setSelectedWaypoint(null);
    }
  }

  const handleToggleInputMode = () => {
    setUseGoogleSearch((prev) => !prev);
  };

  const isPlotButtonDisabled = !currentWaypoint.latitude || !currentWaypoint.longitude;

  return (
    <div>
      <div>
        <div className={`waypoint-form-panel ${isPanelOpen ? 'open' : 'closed'}`}>
          <h3>{selectedWaypoint ? "Edit Destination" : "Add Destination"}</h3>
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
            <button onClick={selectedWaypoint ? handleUpdateWaypoint : handleAddWaypoint} disabled={isPlotButtonDisabled}>
              {selectedWaypoint ? "Save" : "Plot"}
            </button>
            <button onClick={handleDeleteWaypoint} disabled={!selectedWaypoint}>
              Delete
            </button>
            {selectedWaypoint && (
              <button onClick={handleSetNewWaypoint} disabled={!isPlotted}>
                Add Successive Destination
              </button>
            )}
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
