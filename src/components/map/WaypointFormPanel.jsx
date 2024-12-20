import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import "../../css/map/WaypointFormPanel.css";

const libraries = ["places"];

const WaypointFormPanel = ({ onAddWaypoint, onUpdateWaypoint, isPanelOpen, togglePanel }) => {
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
    price: ""
  });
  const [useGoogleSearch, setUseGoogleSearch] = useState(true);
  const [address, setAddress] = useState("");
  const [isPlotted, setIsPlotted] = useState(false); // Track if "Plot" was clicked

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
    onAddWaypoint(); // Increment waypoint index or add to the route
    setCurrentWaypoint({
      title: "",
      description: "",
      info: "",
      latitude: "",
      longitude: "",
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
      latitude: parseFloat(currentWaypoint.latitude),
      longitude: parseFloat(currentWaypoint.longitude),
      price: parseFloat(currentWaypoint.price)
    });
    setIsPlotted(true); // Mark as plotted
  };

  const handleToggleInputMode = () => {
    setUseGoogleSearch((prev) => !prev);
  };

  // Determine if "Plot" button should be enabled
  const isPlotButtonDisabled = !currentWaypoint.latitude || !currentWaypoint.longitude;

  return (
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
            {/* Latitude and Longitude input fields in a row */}
            <div className="lat-lon-container">
              <input
                  type="number"
                  name="lat"
                  placeholder="Latitude"
                  value={currentWaypoint.latitude}
                  onChange={handleChange}
              />
              <input
                  type="number"
                  name="lon"
                  placeholder="Longitude"
                  value={currentWaypoint.longitude}
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
  );
};

export default WaypointFormPanel;
