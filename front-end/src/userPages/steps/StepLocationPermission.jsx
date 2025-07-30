import React, { useState } from "react";

const StepLocationPermission = ({ data, updateData, next }) => {
  const [location, setLocation] = useState(data.location || "");
  const [coords, setCoords] = useState(data.coords || null);
  const [error, setError] = useState("");

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
        updateData({ coords: { lat, lng }, location: `Lat: ${lat}, Lng: ${lng}` });
        setError("");
        // Automatically go to next step
        next();
      },
      (err) => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  return (
    <>
      <div className="header-area">
        <img className="form-logo" style={{ height: 50, width: 50 }} src="/images/j-svg.svg" alt="Logo" />
      </div>
      <header className="form-header">
        <h1 style={{ fontSize: 38, color: "#f9f9f9" }} className="form-subtitle">
          Account Creation
        </h1>
        <a style={{ fontSize: 20 }} className="form-title">
          We need a few permissions from you.
        </a>
      </header>
      <form className="membership-form" onSubmit={e => e.preventDefault()}>
        <button
          type="button"
          className="submit-button white-btn"
          style={{ marginBottom: 10 }}
          onClick={handleAllowLocation}
        >
          Allow Location
        </button>
        {error && (
          <div style={{ color: "var(--primary-red)", marginTop: 10 }}>{error}</div>
        )}
      </form>
    </>
  );
};

export default StepLocationPermission;