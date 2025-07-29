import React from "react";

const StepNotificationPermission = ({ next, back }) => (
  <>
    <div className="header-area">
      <img className="form-logo" style={{ height: 50, width: 50 }} src="/images/j-svg.svg" alt="Logo" />
    </div>
    <header className="form-header">
      <h1 style={{ fontSize: 38, color: "#f9f9f9" }} className="form-subtitle">
        Notifications
      </h1>
      <a style={{ fontSize: 20 }} className="form-title">
        Would you like to receive notifications?
      </a>
    </header>
    <form className="membership-form" onSubmit={e => { e.preventDefault(); next(); }}>
      <div className="form-group" style={{ gap: 15 }}>
        <button
          type="button"
          className="submit-button"
          style={{ marginRight: 10, background: "#8c2022", color: "#fff" }}
          onClick={next}
        >
          Allow
        </button>
        <button
          type="button"
          className="submit-button white-btn"
          onClick={next}
        >
          Not Now
        </button>
      </div>
      <button type="button" className="submit-button white-btn" style={{ marginTop: 10 }} onClick={back}>
        Back
      </button>
    </form>
  </>
);

export default StepNotificationPermission;