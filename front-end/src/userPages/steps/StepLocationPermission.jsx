import React from "react";

const StepLocationPermission = ({ next }) => (
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
    <form className="membership-form" onSubmit={e => { e.preventDefault(); next(); }}>
      <div className="form-group">
        <label className="form-label">Where are you from?</label>
        <input className="form-input" type="text" placeholder="Enter your city or location" required />
      </div>
      <button className="submit-button white-btn" style={{ marginBottom: 10 }}>Allow Location & Next</button>
    </form>
  </>
);

export default StepLocationPermission;