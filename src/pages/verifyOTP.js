import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleInput = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        navigate("/resetPassword", { state: { email } });
      } else {
        setError("Invalid OTP! Please try again.");
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
          Verify OTP
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label
              htmlFor="otp"
              style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}
            >
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleInput}
              placeholder="Enter your OTP"
              style={styles.input}
            />
          </div>
          {error && (
            <div style={{ ...styles.error, color: darkMode ? "#ff6b6b" : "#ff0000" }}>
              {error}
            </div>
          )}
          <button type="submit" style={styles.button}>
            Verify OTP
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

export default VerifyOTP;
