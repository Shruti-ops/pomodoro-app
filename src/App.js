import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const modes = {
    work: { duration: 25 * 60, label: 'Focus Time', color: 'pink-500' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'rose-400' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'pink-600' }
  };

  useEffect(() => {
  if (isActive && intervalRef.current === null) {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(intervalRef.current);
}, [isActive]);

useEffect(() => {
  if (timeLeft === 0) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsActive(false);

    // Timer completed – play the sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Switch modes (e.g., work → break)
    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      const nextMode = newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(modes[nextMode].duration);
    } else {
      setMode('work');
      setTimeLeft(modes.work.duration);
    }
  }
}, [timeLeft]);



  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  setIsActive(false);
  setTimeLeft(modes[mode].duration);
};


  const switchMode = (newMode) => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  setIsActive(false);
  setMode(newMode);
  setTimeLeft(modes[newMode].duration);
};


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const audioRef = useRef(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pomodoro Timer</h1>
          <p className="text-gray-600">Stay focused and productive</p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-pink-50 rounded-2xl p-1 mb-8">
          {Object.entries(modes).map(([key, modeData]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                mode === key
                  ? 'bg-white text-pink-600 shadow-md'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-white/50'
              }`}
            >
              {key === 'work' ? 'Focus' : key === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative flex items-center justify-center mb-8">
          <div
            className="w-64 h-64 rounded-full timer-circle flex items-center justify-center"
            style={{ '--progress': `${progress}%` }}
          >
            <div className="w-56 h-56 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-gray-600 font-medium">
                {modes[mode].label}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95"
          >
            Reset
          </button>
        </div>

        {/* Session Counter */}
        <div className="text-center">
          <div className="inline-flex items-center bg-pink-50 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">
              Sessions completed: {sessions}
            </span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i < sessions % 4 ? 'bg-pink-500 scale-110' : 'bg-pink-200'
              }`}
            />
          ))}
        </div>
      </div>
      <audio ref={audioRef} src="/sounds/alarm.mp3" preload="auto" />

    </div>
  );
}

export default App;
