"use client"
import React, { useState, useEffect } from "react";

export default function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Update the timeLeft state whenever the minutes or seconds are adjusted
  useEffect(() => {
    setTimeLeft(minutes * 60 + seconds);
  }, [minutes, seconds]);

  // Timer logic to decrease time every second
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleMinutesChange = (e) => {
    setMinutes(parseInt(e.target.value));
  };

  const handleSecondsChange = (e) => {
    setSeconds(parseInt(e.target.value));
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(0);
    setSeconds(0);
    setTimeLeft(0);
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className=" flex justify-center my-10">
    <div className="flex flex-col items-center bg-gray-100 p-8 rounded-lg shadow-lg w-80">
      <h1 className="text-2xl font-bold mb-4">Timer</h1>
      
      {/* Display Time */}
      <div className="text-4xl font-mono mb-4">{formatTime()}</div>
      
      {/* Sliders for Minutes and Seconds */}
      <div className="mb-4">
        <label className="block text-gray-700">Minutes: {minutes}</label>
        <input
          type="range"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinutesChange}
          className="w-full"
          disabled={isRunning}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Seconds: {seconds}</label>
        <input
          type="range"
          min="0"
          max="59"
          value={seconds}
          onChange={handleSecondsChange}
          className="w-full"
          disabled={isRunning}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleStart}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={isRunning || timeLeft === 0}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          disabled={!isRunning}
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
    </div>
  );
};

