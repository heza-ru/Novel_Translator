import React, { useState, useEffect } from 'react';
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import Preloader from './components/Preloader'; // Import Preloader
import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds timeout

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    // The Preloader component will be centered via its own CSS or wrapper CSS if needed.
    // For now, just rendering it directly.
    return <Preloader />;
  }

  return (
    <main>
      <div className='main'>
        <div className='gradient' />
      </div>

      <div className='app'>
        <Hero />
        <Demo />
      </div>
    </main>
  );
};

export default App;