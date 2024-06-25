import React from 'react';
import { useTheme } from "../ThemeContext";
import { FaChrome, FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './Contributors.css'; // Import CSS for styling

// Import local images
import anmolimg from './anmol.png';
import vishalimg from './vishal.jpeg';

const contributors = [
  {
    name: "Anmol Tiwari",
    profile: "Software Engineer with a passion for open-source projects.",
    image: anmolimg, // Use imported local image
    social: {
      github: "https://github.com/anmoltiwari0712",
      linkedin: "https://www.linkedin.com/in/anmol-tiwari-0bbb14227/",
      twitter: "https://x.com/oanmoltiwari7",
      youtube: "https://youtube.com/johndoe",
      instagram: "https://www.instagram.com/oanmoltiwari7/  ",
      email: "https://askmeanmol.vercel.app"
    },
  },
  {
    name: "Vishal Singh",
    profile: "Front-end Developer and UI/UX enthusiast.",
    image: vishalimg, // Use imported local image
    social: {
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith",
      youtube: "https://youtube.com/janesmith",
      instagram: "https://instagram.com/janesmith",
      email: "mailto:janesmith@example.com"
    },
  },
];

const Contributors = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`contributors-page ${darkMode ? 'dark' : 'light'}`}>
      <h3>"Meet the Minds Behind the Magic!"</h3>
      <div className="contributors-list">
        {contributors.map((contributor, index) => (
          <div key={index} className="contributor-card">
            <img src={contributor.image} alt={contributor.name} className="contributor-image" />
            <h3 className='name-head '>{contributor.name}</h3>
            <p>{contributor.profile}</p>
            <div className="social-icons">
              <a href={contributor.social.github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href={contributor.social.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href={contributor.social.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href={contributor.social.youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href={contributor.social.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href={contributor.social.email} target="_blank" rel="noopener noreferrer">
                <FaChrome />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
