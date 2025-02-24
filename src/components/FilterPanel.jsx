import React, { useState } from "react";
import "../css/FilterPanel.css";

const FilterPanel = ({ onApplyFilters, onCloseFilters }) => {
  
  const sliderConfig = {
    price: { min: 0, max: 1000 },
    duration: { min: 0, max: 100 },
    rating: { min: 0, max: 5 },
  };

  const baseFilterState = {
    price: [sliderConfig.price.min, sliderConfig.price.max],
    duration: [sliderConfig.duration.min, sliderConfig.duration.max],
    rating: [sliderConfig.rating.min, sliderConfig.rating.max],
    countries: "",
    tags: "",
  };

  const [filters, setFilters] = useState(baseFilterState);
  
  const handleSliderChange = (key, newLow, newHigh) => {
    const { min, max } = sliderConfig[key];
    // Minimum difference is 10% of the total range
    const minDiff = (max - min) * 0.1;
  
    setFilters((prevFilters) => {
      const [currentLow, currentHigh] = prevFilters[key];
  
      // Determine which thumb is being moved:
      if (newLow !== currentLow) {
        // Left thumb is moving.
        // Clamp newLow so that it does not exceed (currentHigh - minDiff)
        const clampedLow = Math.max(min, Math.min(newLow, currentHigh - minDiff));
        return { ...prevFilters, [key]: [clampedLow, currentHigh] };
      } else if (newHigh !== currentHigh) {
        // Right thumb is moving.
        // Clamp newHigh so that it does not fall below (currentLow + minDiff)
        const clampedHigh = Math.min(max, Math.max(newHigh, currentLow + minDiff));
        return { ...prevFilters, [key]: [currentLow, clampedHigh] };
      }
  
      return prevFilters;
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const clearFilters = () => {
    setFilters(baseFilterState);
    onApplyFilters({});
  }

  return (
    <div className="filter-panel">
      <div className="filter-triangle"></div>
      <div className="filter-content">
        <h3 className="filter-title">Filters</h3>

        {/* Price Filter */}
        <div className="filter-group">
          <label className="filter-label">Price ($):</label>
          <div className="custom-range-slider">
            <input
              type="range"
              min={sliderConfig.price.min}
              max={sliderConfig.price.max}
              step="any"
              value={Math.round(filters.price[0])}
              onChange={(e) =>
                handleSliderChange("price", Number(e.target.value), filters.price[1])
              }
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={sliderConfig.price.min}
              max={sliderConfig.price.max}
              step="any"
              value={Math.round(filters.price[1])}
              onChange={(e) =>
                handleSliderChange("price", filters.price[0], Number(e.target.value))
              }
              className="thumb thumb-right"
            />

            <div className="slider-track">
              <div
                className="slider-range"
                style={{
                  left: `${(filters.price[0] / sliderConfig.price.max) * 100}%`,
                  right: `${100 - (filters.price[1] / sliderConfig.price.max) * 100}%`,
                }}
              ></div>
            </div>

            <div className="range-labels">
              ${Math.round(filters.price[0])} - ${Math.round(filters.price[1])}
            </div>
          </div>
        </div>

        {/* Duration Filter */}
        <div className="filter-group">
          <label className="filter-label">Duration (Days):</label>
          <div className="custom-range-slider">
            <input
              type="range"
              min={sliderConfig.duration.min}
              max={sliderConfig.duration.max}
              step="any"
              value={filters.duration[0]}
              onChange={(e) =>
                handleSliderChange("duration", Number(e.target.value), filters.duration[1])
              }
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={sliderConfig.duration.min}
              max={sliderConfig.duration.max}
              step="any"
              value={filters.duration[1]}
              onChange={(e) =>
                handleSliderChange("duration", filters.duration[0], Number(e.target.value))
              }
              className="thumb thumb-right"
            />

            <div className="slider-track">
              <div
                className="slider-range"
                style={{
                  left: `${((filters.duration[0]) / sliderConfig.duration.max) * 100}%`,
                  right: `${100 - ((filters.duration[1]) / sliderConfig.duration.max) * 100}%`,
                }}
              ></div>
            </div>

            <div className="range-labels">
              {Math.round(filters.duration[0])} - {Math.round(filters.duration[1])} Days
            </div>
          </div>
        </div>

        {/* Country Filter */}
        <div className="filter-group">
          <label className="filter-label">Countries:</label>
          <input
            type="text"
            value={filters.countries}
            onChange={(e) =>
              setFilters((prevFilters) => ({ ...prevFilters, countries: e.target.value }))
            }
            placeholder="Enter countries (comma-separated)"
            className="filter-input"
          />
        </div>

        {/* Tags Filter */}
        <div className="filter-group">
          <label className="filter-label">Tags:</label>
          <input
            type="text"
            value={filters.tags}
            onChange={(e) =>
              setFilters((prevFilters) => ({ ...prevFilters, tags: e.target.value }))
            }
            placeholder="Enter tags (comma-separated)"
            className="filter-input"
          />
        </div>

        {/* Rating Filter */}
        <div className="filter-group">
          <label className="filter-label">Rating (Stars):</label>
          <div className="custom-range-slider">
            <input
              type="range"
              min={sliderConfig.rating.min}
              max={sliderConfig.rating.max}
              step="any"
              value={filters.rating[0]}
              onChange={(e) =>
                handleSliderChange("rating", Number(e.target.value), filters.rating[1])
              }
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={sliderConfig.rating.min}
              max={sliderConfig.rating.max}
              step="any"
              value={filters.rating[1]}
              onChange={(e) =>
                handleSliderChange("rating", filters.rating[0], Number(e.target.value))
              }
              className="thumb thumb-right"
            />

            <div className="slider-track">
              <div
                className="slider-range"
                style={{
                  left: `${((filters.rating[0]) / sliderConfig.rating.max) * 100}%`,
                  right: `${100 - ((filters.rating[1]) / sliderConfig.rating.max) * 100}%`,
                }}
              ></div>
            </div>

            <div className="range-labels">
            {Math.round(filters.rating[0] * 10) / 10} - {Math.round(filters.rating[1] * 10) / 10} Stars
            </div>
          </div>
        </div>

        <button className="apply-filters-button" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="clear-filters-button" onClick={clearFilters}>
          Clear Filters
        </button>
        <button className="close-filters-button" onClick={onCloseFilters}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
