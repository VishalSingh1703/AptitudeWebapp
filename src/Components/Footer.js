import React from "react";
import { useTheme } from "../ThemeContext";
import "./Footer.css"; // Import the CSS file for the footer styles

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`footer ${darkMode ? "footer-dark" : "footer-light"}`}>
      <div className="footer-content">
        <p>© {new Date().getFullYear()} AptiQuest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
