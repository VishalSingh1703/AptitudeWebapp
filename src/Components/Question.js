import React, { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth"; // Import useAuth
import { useNavigate } from "react-router-dom";
import "./Question.css"; 

const Question = ({ question, index, onCheckboxChange }) => {
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { isLoggedIn } = useAuth(); 
  const navigate = useNavigate();

  const optionsObject = question.options[0]; 
  const optionLabels = Object.keys(optionsObject); 
  const optionValues = Object.values(optionsObject); 

  const handleCheckboxChange = (event) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsChecked(event.target.checked);
    onCheckboxChange(event.target.checked, question._id);
  };

  
  const getOptionLabel = (idx) => {
    return String.fromCharCode(65 + idx); // 65 is ASCII code for 'A'
  };

  return (
    <Card
      className={`mb-3 ${darkMode ? "text-light" : ""}`}
      style={darkMode ? { backgroundColor: "#303030", color: "#ffffff" } : {}}
    >
        <Card.Header
          className={`d-flex justify-content-between align-items-center ${
            darkMode ? "text-light" : ""
          }`}
          style={darkMode ? { backgroundColor: "#474747" } : {}}
        >
          <span>
            {index + 1}. <strong>{question.question}</strong>
          </span>
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark"></span>
          </label>
        </Card.Header>
      <Card.Body>
        <ul className="list-unstyled">
          {optionLabels.map((label, idx) => (
            <li key={idx}>
              <strong>{label}</strong> {optionsObject[label]}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls={`answer${index}`}
          aria-expanded={open}
          className="mt-3"
          style={{
            backgroundColor: "#ee4b2b",
            borderColor: "#ee4b2b",
            color: "#ffffff",
          }}
        >
          Show Answer
        </Button>
        <Collapse in={open}>
          <div id={`answer${index}`} className="mt-3">
            <strong>Answer:</strong> {question.correct_answer}
            <br />
            <strong>Explanation:</strong> {question.explanation}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default Question;
