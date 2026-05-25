"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [...prev, time]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Timer className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Millisecond Stopwatch</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-black/30 rounded-2xl p-8 border border-zinc-800">
          <div className="text-6xl font-black font-mono tracking-wider text-zinc-900 dark:text-white mb-6">
            {formatTime(time)}
          </div>

          <div className="flex gap-4">
            {isActive ? (
              <button onClick={handlePause} className="bg-amber-600 hover:bg-amber-500 text-white font-bold p-3 rounded-full cursor-pointer transition-colors shadow">
                <Pause className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-full cursor-pointer transition-colors shadow">
                <Play className="w-5 h-5" />
              </button>
            )}
            <button onClick={handleLap} disabled={!isActive} className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-bold p-3 rounded-full cursor-pointer transition-colors shadow disabled:opacity-30">
              <Flag className="w-5 h-5" />
            </button>
            <button onClick={handleReset} className="bg-zinc-850 hover:bg-zinc-850 text-white font-bold p-3 rounded-full cursor-pointer transition-colors shadow">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Laps List */}
        <div className="space-y-4 flex flex-col justify-between max-h-[300px]">
          <span className="text-xs text-zinc-400 font-bold uppercase block border-b border-zinc-850 pb-2">Split Laps Record</span>
          {laps.length > 0 ? (
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs bg-zinc-50 dark:bg-black/10 p-2.5 rounded-xl border border-zinc-850">
                  <span className="text-zinc-500">Lap {idx + 1}</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
              Press flag icon to save splits during timer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}