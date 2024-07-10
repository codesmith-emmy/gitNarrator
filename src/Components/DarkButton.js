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
     
  };

  return (
    <>
    <div className="buttonWrapper">
    <button onClick={toggleDarkMode} className={`dark-mode-button`}>
        {darkMode ? <MdDarkMode size={30} />  : <HiOutlineLightBulb size={30} color='skyblue' />}
    </button>
    
    </div>
    </>
  );
}

export default DarkButton;
