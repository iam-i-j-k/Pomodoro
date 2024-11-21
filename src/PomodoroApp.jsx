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
            <h1 className='text-center text-2xl sm:text-8xl font-bold py-4'>
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-blue-500'>Pomodoro App</span> 
            </h1>
            <FocusTime 
                formattedTime={formattedTime}
                sessionHistory={sessionHistory}
                sessionNumber={sessionNumber}
                timeLeft={timeLeft}
                isRunning={isRunning}
            />
        </div>
    )
}

export default PomodoroApp
