import React from 'react'
import { useState } from 'react';
import './DarkButton.css'
 


function DarkButton() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  };

  return (
    <button onClick={toggleDarkMode} className={`dark-button ${darkMode ? 'rotate slide-in' : ''}`}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default DarkButton;
