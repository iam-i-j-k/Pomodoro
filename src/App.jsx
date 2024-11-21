import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';
import MainComponent from './MainComponent';
import PomodoroApp from './PomodoroApp'
const App = () => {

  const [showMain, setShowMain] = useState(false);

    const handleClick = () => {
        setShowMain(true);
    };

  return (
    <>
      <div className='bg-gradient-to-br from-slate-950 to-slate-900 w-full h-screen'>
        <PomodoroApp />
      </div>
    </>
  )
}

export default App
