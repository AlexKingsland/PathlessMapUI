import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import "../../css/map/WaypointFormPanel.css"; // Add custom styling here

const libraries = ["places"]; // Specify the libraries to be loaded

const WaypointFormPanel = ({ onAddWaypoint, onCreateMap, onClose }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use your API key stored as an environment variable
    libraries,
  });

  const [currentWaypoint, setCurrentWaypoint] = useState({
    title: "",
    description: "",
    info: "",
    latitude: "",
    longitude: "",
    tags: "",
    times_of_day: "",
    price: ""
  });
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [address, setAddress] = useState("");

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
    onAddWaypoint({
      ...currentWaypoint,
      latitude: parseFloat(currentWaypoint.latitude),
      longitude: parseFloat(currentWaypoint.longitude),
      price: parseFloat(currentWaypoint.price),
      times_of_day: currentWaypoint.times_of_day ? JSON.parse(currentWaypoint.times_of_day) : {}
    });
    setCurrentWaypoint({
      title: "",
      description: "",
      info: "",
      latitude: "",
      longitude: "",
      tags: "",
      times_of_day: "",
      price: ""
    });
    setAddress("");
  };

  const handleToggleInputMode = () => {
    setUseGoogleSearch((prev) => !prev);
  };

  return (
    <div className="waypoint-form-panel">
      <h3>Add Waypoint</h3>
      <button onClick={handleToggleInputMode}>
        {useGoogleSearch ? "Switch to Manual Input" : "Switch to Google Maps Input"}
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
                  console.log(suggestion);
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
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={currentWaypoint.tags}
            onChange={handleChange}
          />
          <input
            type="text"
            name="times_of_day"
            placeholder='Times of Day (JSON format: {"morning": true})'
            value={currentWaypoint.times_of_day}
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
      )}

      <button onClick={handleAddWaypoint}>Next Waypoint</button>
      <button onClick={onCreateMap}>Done</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default WaypointFormPanel;
