import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleInput = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        setError("Error resetting password! Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#191919" : "#fff",
      }}
    >
      <div
        style={{
          ...styles.formContainer,
          backgroundColor: darkMode ? "#222222" : "#fff",
        }}
      >
        <h1 style={{ ...styles.welcome, color: darkMode ? "#ccc" : "#000" }}>
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label
              htmlFor="newPassword"
              style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleInput}
              placeholder="Enter your new password"
              style={styles.input}
            />
          </div>
          {error && (
            <div style={{ ...styles.error, color: darkMode ? "#ff6b6b" : "#ff0000" }}>
              {error}
            </div>
          )}
          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { /* your styles */ },
  formContainer: { /* your styles */ },
  welcome: { /* your styles */ },
  form: { /* your styles */ },
  inputGroup: { /* your styles */ },
  label: { /* your styles */ },
  input: { /* your styles */ },
  error: { /* your styles */ },
  button: { /* your styles */ }
};

export default ResetPassword;
