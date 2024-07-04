import React from 'react'
import { useState } from 'react';
import './DarkButton.css'
import { HiOutlineLightBulb } from "react-icons/hi2";
import { MdDarkMode } from "react-icons/md";

function DarkButton() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    document.querySelector("#header ").classList.toggle('dark-mode', darkMode);
    const header = document.querySelector("#header");
    const h1 = document.querySelector("h1");
    if (header && h1) {
      header.style.backgroundColor = darkMode ? "black" : "skyblue";
      header.style.borderBottom = darkMode ? "1px solid skyblue" : "1px solid #e0e0e0";
    
      h1.style.color = darkMode ? "white" : "WhiteSmoke";
    }
    const messageArea = document.querySelector("#message-areas");
    if (messageArea) {
      messageArea.style.backgroundColor = darkMode ? "black" : "#f9f9f9";
    }
    
    document.querySelector("#input-container").style.backgroundColor = darkMode ? "black" : "#fff";
    document.querySelector("#input-container").style.borderTop = "1px solid skyblue";
    const userInput = document.querySelector("#user-input");
    if (userInput) {
      userInput.style.backgroundColor = darkMode ? "white" : "#f6f6f6";
    }
     
    
  };

  return (
    <>
    <div className="buttonWrapper">
    <button onClick={toggleDarkMode} className={`dark-mode-button`}>
        {darkMode ? <MdDarkMode size={30} />  : <HiOutlineLightBulb size={30} color='white' />}
    </button>
    
    </div>
    </>
  );
}

export default DarkButton;
