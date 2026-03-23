import React, { useContext } from "react";
import { useNavigate } from "react-router";
import "./Success.css";
import { ThemeContext } from "../../Context/ThemeContext";

const Success = () => {
  const navigate = useNavigate();
  const { theme, getThemeStyle } = useContext(ThemeContext); //theme toggle/ style apply
  localStorage.setItem("subscriptionType", "premium");
  return (
    <div className="success-container" style={getThemeStyle(theme)}>
      <div className="success-card">

        <div className="success-icon">
          <svg
            className="check-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="success-title">
          Payment Successful 🎉
        </h1>

        <p className="success-text">
          Thank you for your subscription. Your payment has been processed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          className="success-button"
        >
          Go to Home
        </button>

      </div>
    </div>
  );
};

export default Success;