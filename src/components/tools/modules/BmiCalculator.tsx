"use client";
import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function BmiCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const heightM = height / 100;
  const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;

  let category = 'Normal';
  let color = 'text-emerald-500';
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    color = 'text-orange-500';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-red-500';
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Activity className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">BMI Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
            <input type="range" min="30" max="150" value={weight} onChange={e => setWeight(parseInt(e.target.value))} className="w-full accent-rose-500 mt-1" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
            <input type="range" min="100" max="220" value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full accent-rose-500 mt-1" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-4">Body Mass Index</h4>
            <p className="text-5xl font-extrabold text-zinc-850 dark:text-white">${bmi.toFixed(1)}</p>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Classification</span>
            <p className={`text-2xl font-bold ${color}`}>${category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}