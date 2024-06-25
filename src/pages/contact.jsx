import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

const Contact = () => {
  const { darkMode } = useTheme();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch("https://formspree.io/f/xldrrojb", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setFormSubmitted(true);
          form.reset();
          console.log("Bug report submitted successfully");
        } else {
          console.log("Failed to submit bug report");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        <h1 style={{ ...styles.heading, color: darkMode ? "#ccc" : "#000" }}>
          Report a Bug
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
              Your name:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
              Your email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="message" style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}>
              Your message:
            </label>
            <textarea
              name="message"
              placeholder="Describe the issue"
              required
              style={{ ...styles.input, height: "100px" }}
            />
          </div>
          <button type="submit" style={styles.button}>
            Send
          </button>
          {formSubmitted && (
            <div style={{ ...styles.successMessage, color: darkMode ? "#0f0" : "#060" }}>
              Thank you! Your message has been sent.
            </div>
          )}
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
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "40px",
    paddingRight: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  heading: {
    fontSize: "24px",
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  inputGroup: {
    marginBottom: "15px",
    width: "100%",
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
  successMessage: {
    marginTop: "20px",
    fontSize: "16px",
  },
};

export default Contact;
