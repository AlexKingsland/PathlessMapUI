import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import "../../css/map/WaypointFormPanel.css"; // Add custom styling here

const libraries = ["places"]; // Specify the libraries to be loaded

const WaypointFormPanel = ({ onAddWaypoint, onUpdateWaypoint, onClose }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use your API key stored as an environment variable
    libraries,
  });

  const [currentWaypoint, setCurrentWaypoint] = useState({
    title: "",
    description: "",
    info: "",
    lat: "",
    lon: "",
    tags: "",
    price: ""
  });
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [address, setAddress] = useState("");
  const [isPlotted, setIsPlotted] = useState(false); // Track if "Plot" was clicked
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Track if the panel is open

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWaypoint((prev) => ({
      ...prev,
      [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value
    }));
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
            lat: location.lat(),
            lon: location.lng(),
            title: value
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
    onAddWaypoint(); // Increment waypoint index or add to the route
    setCurrentWaypoint({
      title: "",
      description: "",
      info: "",
      lat: "",
      lon: "",
      tags: "",
      price: ""
    });
    setAddress("");
    setIsPlotted(false); // Reset the plot status
  };

  const handleUpdateWaypoint = () => {
    console.log("Current Waypoint being updated:", currentWaypoint);
    onUpdateWaypoint({
      ...currentWaypoint,
      lat: parseFloat(currentWaypoint.lat),
      lon: parseFloat(currentWaypoint.lon),
      price: parseFloat(currentWaypoint.price)
    });
    setIsPlotted(true); // Mark as plotted
  };

  const handleToggleInputMode = () => {
    setUseGoogleSearch((prev) => !prev);
  };

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  // Determine if "Plot" button should be enabled
  const isPlotButtonDisabled = !currentWaypoint.lat || !currentWaypoint.lon;

  return (
    <div>
      <div className={`waypoint-form-panel ${isPanelOpen ? 'open' : 'closed'}`}>
        <button className="close-button" onClick={togglePanel}>X</button>
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
            {/* Latitude and Longitude input fields in a row */}
            <div className="lat-lon-container">
              <input
                  type="number"
                  name="lat"
                  placeholder="Latitude"
                  value={currentWaypoint.lat}
                  onChange={handleChange}
              />
              <input
                  type="number"
                  name="lon"
                  placeholder="Longitude"
                  value={currentWaypoint.lon}
                  onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Common fields that stay visible */}
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

        {/* Button group for secondary actions */}
        <div className="button-group">
            <button onClick={handleUpdateWaypoint} disabled={isPlotButtonDisabled}>
                Plot
            </button>
        </div>

        {/* Full-width primary action button */}
        <button className="primary-button next-button" onClick={handleAddWaypoint} disabled={!isPlotted}>
            Next
        </button>
      </div>
      {!isPanelOpen && (
        <button className="reopen-button" onClick={togglePanel}>
          <div className="hamburger-icon">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default WaypointFormPanel;
