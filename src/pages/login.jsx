import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth";
import Popup from "./popup";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const {storeTokenInLS} = useAuth(); 

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const responseData = await response.json();
        storeTokenInLS(responseData.token);
        console.log("after login: ", responseData);
        navigate("/");
      } else {
        const responseData = await response.json();
        if (responseData.msg === "DNE") {
          setPopupMessage("User Does Not Exist! Try Creating a new Account");
          setShowPopup(true); // Show popup on login failure
        } else if (responseData.msg === "IP") {
          setPopupMessage("Incorrect password, try again.");
          setShowPopup(true); 
        }
        console.log("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupMessage === "User Does Not Exist! Try Creating a new Account") {
      navigate("/register");
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
          Welcome back to
        </h1>
        <h2 style={styles.heading}>
          <span style={styles.apti}>Apti</span>
          <span style={{ ...styles.quest, color: darkMode ? "#fff" : "#000" }}>
            Quest
          </span>
        </h2>
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
              value={user.email}
              onChange={handleInput}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label
              htmlFor="password"
              style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
          <div style={styles.options}>
            <button
              type="button"
              onClick={() => navigate("/forgotpassword")}
              style={styles.forgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          <div
            style={{
              ...styles.registerLink,
              color: darkMode ? "#ccc" : "#000",
            }}
          >
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={styles.registerButton}
            >
              Create account
            </button>
          </div>
        </form>
      </div>

      {/* Popup for login failure */}
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={closePopup}
          darkMode={darkMode}
        />
      )}
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
  apti: {
    color: "#ff0000", // Red color for "Apti"
    fontFamily: "'Playwrite NG Modern', sans-serif",
  },
  quest: {
    color: "#fff", // White color for "Quest"
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
  heading: {
    fontSize: "30px",
    textAlign: "center",
    color: "#ff0000",
    marginBottom: "20px",
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
  options: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  forgotPassword: {
    background: "none",
    border: "none",
    color: "#ef5753",
    cursor: "pointer",
    fontSize: "14px",
  },
  registerLink: {
    marginTop: "20px",
    textAlign: "center",
  },
  registerButton: {
    background: "none",
    border: "none",
    color: "#ef5753",
    cursor: "pointer",
    fontSize: "14px",
  },
  // Popup styles
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    zIndex: 1000,
    textAlign: "center",
  },
  popupText: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  popupButton: {
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#ef5753",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Login;
