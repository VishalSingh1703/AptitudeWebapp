// src/Components/Navbar.js
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import img from "./logowhitemode.png";
import { useAuth } from "../store/auth";
import imgDark from "./logodarkmode.png"; // Import the dark mode logo image

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleLogoutClick = () => {
    navigate("/logout ");
  };

  return (
      <nav
        className="nav"
        style={{
          backgroundColor: darkMode ? "#191919" : "#fff",
          color: darkMode ? "#fff" : "#333",
        }}
      >
        <div className="logo">
          <img src={darkMode ? imgDark : img} alt="Logo" className="logoImg" />
        </div>
        <div>
          <ul className="nav-ul">
            <li>
              <NavLink
                to="/"
                style={{
                  backgroundColor: darkMode ? "#191919" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contributors"
                style={{
                  backgroundColor: darkMode ? "#191919" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                }}
              >
                Contributors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                style={{
                  backgroundColor: darkMode ? "#191919" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                }}
              >
                Report a Bug
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="rightIcons">
          <button onClick={toggleDarkMode} className="darkModeButton">
            {darkMode ? <FaSun color="#FFD700" /> : <FaMoon color="#4B0082" />}
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogoutClick} className="logoutButton">
              Logout
            </button>
          ) : (
            <button onClick={handleLoginClick} className="loginButton">
              Login
            </button>
          )}
        </div>
      </nav>
    
  );
};

export default Navbar;
