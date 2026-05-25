"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OnlineTimer() {
  const [seconds, setSeconds] = useState(300); // 5 mins default
  const [isActive, setIsActive] = useState(false);
  const [inputVal, setInputVal] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      triggerAlarm();
      toast.success('Time is up!');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds]);

  const triggerAlarm = () => {
    // Play dual oscillator alarm sounds
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
      }, 1500);
    } catch (e) {
      console.log(e);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(inputVal * 60);
  };

  const setPreset = (mins: number) => {
    setIsActive(false);
    setInputVal(mins);
    setSeconds(mins * 60);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Timer className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Online Alarm Timer</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Counter Display */}
        <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-black/30 rounded-2xl p-8 border border-zinc-800">
          <div className="text-6xl font-black font-mono tracking-wider text-zinc-900 dark:text-white mb-6">
            {formatTime(seconds)}
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
            <button onClick={handleReset} className="bg-zinc-850 hover:bg-zinc-800 text-white font-bold p-3 rounded-full cursor-pointer transition-colors shadow">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configurations */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-bold uppercase">Set Timer (Minutes)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={inputVal}
                onChange={e => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setInputVal(val);
                  if (!isActive) setSeconds(val * 60);
                }}
                className="bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white text-sm outline-none w-24"
              />
              <span className="text-zinc-500 text-xs flex items-center">minutes</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-850">
            <span className="text-xs text-zinc-400 font-bold uppercase block">Quick Presets</span>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 15, 30, 60].map(mins => (
                <button 
                  key={mins}
                  onClick={() => setPreset(mins)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}