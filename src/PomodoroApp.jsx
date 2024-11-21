import React, { useState, useEffect } from 'react';
import FocusTime from './FocusTime';

const PomodoroApp = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionNumber, setSessionNumber] = useState(() => {
        const saved = localStorage.getItem('pomodoroSession');
        return saved ? JSON.parse(saved).currentSession : 1;
    });

    const [sessionHistory, setSessionHistory] = useState(() => {
        const saved = localStorage.getItem('pomodoroHistory');
        return saved ? JSON.parse(saved) : [];
    });
    useEffect(() => {
        localStorage.setItem('pomodoroSession', JSON.stringify({ currentSession: sessionNumber }));
    }, [sessionNumber]);

    useEffect(() => {
        let intervalId;
        if (isRunning && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            const sessionData = {
                sessionNumber,
                completedAt: new Date().toISOString(),
                duration: '25:00',
            };
            setSessionHistory(prev => {
                const newHistory = [...prev, sessionData];
                localStorage.setItem('pomodoroHistory', JSON.stringify(newHistory));
                return newHistory;
            });
        }
        return () => clearInterval(intervalId);
    }, [isRunning, timeLeft, sessionNumber]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setTimeLeft(25 * 60);
        setIsRunning(false);
    };

    const changeSession = () => {
        setSessionNumber(1);
        resetTimer();
    }

    const nextSession = () => {
        if (sessionNumber < 4) {
            const sessionData = {
                sessionNumber,
                completedAt: new Date().toISOString(),
                duration: `${Math.floor((25 * 60 - timeLeft) / 60)}:${((25 * 60 - timeLeft) % 60).toString().padStart(2, '0')}`,
            };
            setSessionHistory(prev => {
                const newHistory = [...prev, sessionData];
                localStorage.setItem('pomodoroHistory', JSON.stringify(newHistory));
                return newHistory;
            });
            
            setSessionNumber(prev => prev + 1);
            setIsRunning(false);
            setTimeLeft(25 * 60);
        }
    };

    return (
        <div className='text-white'>
            <h1 className='text-center text-4xl sm:text-8xl font-bold py-4 sm:pt-4'>
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-blue-500'>Pomodoro App</span> 
            </h1>
            <FocusTime 
                formattedTime={formattedTime}
                sessionHistory={sessionHistory}
                sessionNumber={sessionNumber}
                timeLeft={timeLeft}
                isRunning={isRunning}
            />

            <div className='px-6'>
                <h2 className='text-center text-xl sm:text-5xl py-10 mb-4'>
                    An online Pomodoro Timer to boost your productivity
                </h2>
                <h3 className=' text-lg sm:text-4xl px-4 pt-8'>
                    What is Pomofocus?
                    
                </h3>
                <span className='bg-slate-400 h-1 w-7 rounded-full inline-block mx-5'>
                </span>

                <p className='text-lg text-slate-400 font-light sm:text-xl px-4 py-8 tracking-wide'>
                    Pomofocus is a customizable pomodoro timer that works on desktop & mobile browser. The aim of this app is to help you focus on any task you are working on, such as study, writing, or coding. This app is inspired by <span className='bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-blue-500'>Pomodoro Technique</span> which is a time management method developed by Francesco Cirillo.</p>


                <h3 className=' text-lg sm:text-4xl px-4 pt-8'>
                    What is Pomodoro Technique?
                    
                </h3>
                <span className='bg-slate-400 h-1 w-7 rounded-full inline-block mx-5'>
                </span>

                <p className='text-lg text-slate-400 font-light  sm:text-xl px-4 py-8 tracking-wide'>
                The Pomodoro Technique is created by Francesco Cirillo for a more productive way to work and study. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student. - <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target='_blank' className='bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-blue-500'>Wikipedia</a></p>
            </div>
        </div>
    )
}

export default PomodoroApp
