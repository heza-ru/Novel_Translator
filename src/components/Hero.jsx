import React from "react";

import { logo, github } from "../assets"; // Import github

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-48 object-contain' />

        <button
          type='button'
          onClick={() =>
            window.open("https://github.com/heza-ru/Novel_Translator", "_blank")
          }
          className='black_btn flex items-center justify-center' // Added flex for alignment
        >
          <img 
            src={github} 
            alt="GitHub Icon" 
            className="w-4 h-4 mr-2 -ml-1" // Applied original SVG classes
          />
          View on GitHub
        </button>
      </nav>

      <h1 className='head_text'>
      
        Translate Web-Novels with <br className='max-md:hidden' />
        <span className='orange_gradient '>OpenAI GPT-4</span>
      </h1>
      <h2 className='desc'>
      Simplify your Korean web novel journey with Iyagiko. Clear and concise translations at your fingertips!
      </h2>
    </header>
  );
};

export default Hero;
