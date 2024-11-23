import React, { useEffect, useState } from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import useSound from 'use-sound';

const BreakTime = ({ onBreakComplete }) => {
    const [playSound] = useSound('./sound.mp3', { volume: 0.5 });
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isRunning && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            try {
                playSound();
                onBreakComplete();
            } catch (error) {
                console.error('Error handling break completion:', error);
            }
        }
        return () => clearInterval(intervalId);
    }, [isRunning, timeLeft, playSound, onBreakComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setTimeLeft(5 * 60);
        setIsRunning(false);
    };

    const skipBreak = () => {
        setTimeLeft(0);
        setIsRunning(false);
        onBreakComplete();
    };

    return (
        <>
            <h2 className='text-xl sm:text-2xl'>Break Time!</h2>
            <div className='flex flex-col items-center mt-6 sm:mt-10 justify-center h-[250px] sm:h-[300px] gap-8 py-5 sm:gap-10 px-10 sm:px-4 w-[280px] sm:w-[500px] border-2 border-slate-800 rounded-md'>
                <h1 className='text-8xl sm:text-9xl font-light time'>
                    {formattedTime}
                </h1>
                <div className='flex items-center gap-2 sm:gap-4'>
                    {isRunning && (
                        <button className='text-xl sm:text-2xl' onClick={resetTimer}>
                            <VscDebugRestart />
                        </button>
                    )}
                    <button 
                        className='bg-blue-500 text-2xl sm:text-3xl text-slate-950 px-4 sm:px-10 py-2 rounded-md tracking-wide flex items-center gap-2' 
                        onClick={toggleTimer}
                    > 
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button 
                        className='bg-red-500 text-2xl sm:text-3xl text-slate-950 px-4 sm:px-10 py-2 rounded-md tracking-wide'
                        onClick={skipBreak}
                    >
                        Skip
                    </button>
                </div>
            </div>
        </>
    )
}

export default BreakTime
