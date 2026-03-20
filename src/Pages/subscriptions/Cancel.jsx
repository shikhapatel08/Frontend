import React, { useContext } from "react";
import { useNavigate } from "react-router";
import "./Cancel.css";
import { ThemeContext } from "../../Context/ThemeContext";

const Cancel = () => {
  const navigate = useNavigate();
  const { theme, getThemeStyle } = useContext(ThemeContext); //theme toggle/ style apply

  return (
    <div className="cancel-container" style={getThemeStyle(theme)}>
      <div className="cancel-card">

        <div className="cancel-icon">
          <svg
            className="cross-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="cancel-title">
          Payment Cancelled ❌
        </h1>

        <p className="cancel-text">
          Your payment was not completed. If this was a mistake, you can try again anytime.
        </p>

        <div className="cancel-buttons">

          <button
            onClick={() => navigate(-1)}
            className="retry-button"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="home-button"
          >
            Go to Home
          </button>

        </div>

      </div>
    </div>
  );
};

export default Cancel;