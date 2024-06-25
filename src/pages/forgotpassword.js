import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useTheme } from "../ThemeContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // State to store the error message
  const { darkMode } = useTheme();
  
  const navigate = useNavigate();

  const handleInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("after password reset: ", responseData);
        navigate("/");
      } else {
        setError("Email not found! Please try again.");
        console.log("Password reset failed");
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
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label
              htmlFor="email"
              style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInput}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>
          {error && (
            <div style={{ ...styles.error, color: darkMode ? "#ff6b6b" : "#ff0000" }}>
              {error}
            </div>
          )}
          <button type="submit" style={styles.button}>
            Submit Password
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  welcome: {
    fontSize: "24px",
    textAlign: "center",
    color: "#333",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#ef5753",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    marginTop: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default ForgotPassword;
