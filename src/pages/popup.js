import React from "react";

const Popup = ({ message, onClose, darkMode }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: darkMode ? "#222222" : "#fff",
        color: darkMode ? "#ccc" : "#000",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        zIndex: "1000",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          padding: "10px 20px",
          fontSize: "14px",
          backgroundColor: "#ef5753",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Popup;
