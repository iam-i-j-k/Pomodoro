import React, { useEffect, useState } from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import { MdSkipNext } from 'react-icons/md'
import { BsArrowRepeat } from 'react-icons/bs';
import useSound from 'use-sound';
import ButtonComponent from './ButtonComponent';
import BreakTime from './BreakTime';

const FocusTime = () => {
    const [playSound] = useSound('./sound.mp3', { volume: 0.5 });

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
            try {
                playSound();
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
            } catch (error) {
                console.error('Error saving session:', error);
            }
        }
        return () => clearInterval(intervalId);
    }, [isRunning, timeLeft, sessionNumber, playSound]);

    const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60);
    const [isBreakTime, setIsBreakTime] = useState(false);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const breakMinutes = Math.floor(breakTimeLeft / 60);
    const breakSeconds = breakTimeLeft % 60;
    const formattedBreakTime = `${breakMinutes}:${breakSeconds.toString().padStart(2, "0")}`;

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
            
            setIsBreakTime(true);
            setIsRunning(false);
            setTimeLeft(25 * 60);
        }
    };

    const handleBreakComplete = () => {
        setIsBreakTime(false);
        setSessionNumber(prev => prev + 1);
    };

    return (
        <div>
            <div className='flex flex-col items-center justify-center py-10 sm:py-5'>
                {!isBreakTime ? (
                    <>
                        <h2 className='text-xl sm:text-2xl text-center px-4'>
                            {`Session ${sessionNumber} of 4 (Focus Time)`}
                        </h2>
                        <div className='flex flex-col items-center mt-6 sm:mt-10 justify-center h-[180px] sm:h-[300px] gap-6 sm:gap-10 px-10 sm:px-4 w-[280px] sm:w-[500px] border-2 border-slate-800 rounded-md'>
                            <h1 className='text-7xl sm:text-9xl font-light time'>
                                {formattedTime}
                            </h1>
                            <div className='flex items-center gap-3 sm:gap-4'>
                                {isRunning && (
                                    <>
                                        <button className='text-2xl' onClick={resetTimer}>
                                            <VscDebugRestart />
                                        </button>
                                    </>
                                )}
                                

                                <button className='bg-blue-500 text-xl text-slate-950 px-[7rem] py-2 rounded-md tracking-wide flex items-center gap-2' onClick={toggleTimer}> 
                                    {isRunning ? (
                                        <>
                                            <span>Pause</span>
                                        </>
                                    ) : 'Start'}
                                </button>
                                {isRunning && sessionNumber < 4 &&
                                 (
                                        <>
                                            <button className='text-2xl' onClick={nextSession}>
                                                <MdSkipNext />
                                            </button>
                                        </>
                                        
                                    )}
                                {isRunning && sessionNumber === 4 && (
                                    <>
                                        <button className='text-2xl' onClick={changeSession}>
                                            <BsArrowRepeat />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <BreakTime
                        breakTimeLeft={breakTimeLeft}
                        setBreakTimeLeft={setBreakTimeLeft}
                        onBreakComplete={handleBreakComplete}
                    />
                )}
            </div>
        </div>
    );
}

export default FocusTime
