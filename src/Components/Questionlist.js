import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "./Question";
import axios from "axios";
import topics from "../config/configuration";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth";

const QuestionList = () => {
  const { path } = useParams();
  const [questions, setQuestions] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [progress, setProgress] = useState({});
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/questions/${path}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [path]);

  useEffect(() => {
    const fetchCompletedQuestions = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/user/completed-questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompletedQuestions(response.data.completedQuestions);
      } catch (error) {
        console.error("Error fetching completed questions:", error);
      }
    };

    const fetchProgress = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/user/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(response.data.progress);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchCompletedQuestions();
    fetchProgress();
  }, [isLoggedIn, token]);

  const handleCheckboxChange = async (checked, questionId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSolvedCount(solvedCount + (checked ? 1 : -1));
    try {
      await axios.post(
        `http://localhost:3000/markquestion`,
        { questionId, topic: path },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompletedQuestions(prev => {
        const updated = { ...prev };
        if (!updated[path]) {
          updated[path] = [];
        }
        if (checked) {
          updated[path].push(questionId);
        } else {
          updated[path] = updated[path].filter(id => id !== questionId);
        }
        return updated;
      });

      setProgress(prev => {
        const updated = { ...prev };
        if (checked) {
          updated[path] = (updated[path] || 0) + 1;
        } else {
          updated[path] = (updated[path] || 1) - 1;
        }
        return updated;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const currentTopic = topics.find((topic) => topic.path === `/${path}`);

  return (
    <div style={{ backgroundColor: darkMode ? '#191919' : '#fff', minHeight: '100vh', paddingTop: '32px' ,paddingBottom: '32px'}}>
      <div style={styles.container}>
        {currentTopic && (
          <div
            style={{
              ...styles.card,
              backgroundColor: darkMode ? "#303030" : "#fff",
            }}
          >
            <h2 style={{ color: darkMode ? "#ff0000" : "#000" }}>
              {currentTopic.title}
            </h2>
            <p style={{ color: darkMode ? "#ccc" : "#000" }}>
              Prepare for {currentTopic.title} with our comprehensive resources
              and practice questions. It is a long established fact that a
              reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English.
            </p>
          </div>
        )}
        <div style={styles.topicWrapper}>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${(progress[path] / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div
            style={{
              ...styles.progressText,
              color: darkMode ? "#ccc" : "#333",
            }}
          >
            {progress[path] || 0}/{questions.length} questions solved
          </div>
        </div>
        {questions.map((question, index) => (
          <Question
            key={index}
            question={question}
            index={index}
            onCheckboxChange={handleCheckboxChange}
            checked={completedQuestions[path]?.includes(question._id)}
          />
        ))}
      </div>
      
    </div>
  );
};

export default QuestionList;

const styles = {
  container: {
    width: "80%",
    margin: "20px auto",
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  topicWrapper: {
    marginBottom: "10px",
  },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#5a5a59",
    height: "10px",
    borderRadius: "5px",
    marginBottom: "5px",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "10px",
    backgroundColor: "#ee4b2b",
    borderRadius: "5px 0 0 5px",
  },
  progressText: {
    marginRight: "10px",
    fontSize: "0.8rem",
    color: "#333",
    textAlign: "center",
  },
};
