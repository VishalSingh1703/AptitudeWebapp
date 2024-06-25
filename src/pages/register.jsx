import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import Popup from "./popup";

const Register = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const [error, setError] = useState(null); 

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const validateInput = () => {
    const { username, email, phone, password } = user;

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");      return false;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError("Username must be between 3 and 20 characters and only contain alphanumeric characters.");      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Registration successful");
        storeTokenInLS(responseData.token);
        setUser({ username: "", email: "", phone: "", password: "" });
        navigate("/");
      } 
      else if(responseData.msg=="User already exists"){
        setError("User already exist");
      }
      else {
        alert( "Error in registration");
      }
    } catch (error) {
      console.error("Error", error);
      setError("Server error");
    }
  };

  const clearError = () => {
    setError(null);
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
        </h1>{" "}
        <h2 style={styles.heading}>
          <span style={styles.apti}>Apti</span>
          <span style={{ ...styles.quest, color: darkMode ? "#fff" : "#000" }}>Quest</span>
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
        {error && (
            <Popup
              message={error}
              onClose={clearError}
              darkMode={darkMode}
            />
          )}
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInput}
              placeholder="Enter your username"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
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
            <label htmlFor="password" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
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
          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleInput}
              placeholder="Enter your phone number"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Register
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
    height: "120vh",
    backgroundColor: "#f0f2f5",
  },
  apti: {
    color: '#ff0000', // Red color for "Apti"
    fontFamily: "'Playwrite NG Modern', sans-serif",
  },
  quest: {
    color: '#fff', // White color for "Quest"
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    marginTop: "0px",
    paddingTop: "20px",
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
};

export default Register;
