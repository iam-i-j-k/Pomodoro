import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';
import MainComponent from './MainComponent';
import PomodoroApp from './PomodoroApp';
import LocomotiveScroll from 'locomotive-scroll';




const App = () => {

  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: true,
  });

  const [showMain, setShowMain] = useState(false);

    const handleClick = () => {
        setShowMain(true);
    };

  return (
    <>
      <div className='bg-gradient-to-br from-slate-950 to-slate-900 w-full h-full'>
        <PomodoroApp />
      </div>
    </>
  )
}

export default App
