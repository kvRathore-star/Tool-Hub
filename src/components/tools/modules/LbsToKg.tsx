"use client";
import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function LbsToKg() {
  const [lbs, setLbs] = useState<string>('1');
  const [kg, setKg] = useState<string>('');

  useEffect(() => {
    const val = parseFloat(lbs);
    if (isNaN(val)) {
      setKg('');
      return;
    }
    setKg((val / 2.20462).toFixed(4).replace(/\.?0+$/, ''));
  }, [lbs]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Scale className="w-8 h-8 text-rose-500" />
           <h2 className="text-2xl font-bold">Lbs to Kg Converter</h2>
         </div>
         <p className="text-zinc-500">Instantly convert Pounds (lbs) to Kilograms (kg).</p>
         
         <div className="flex flex-col md:flex-row items-center gap-6 justify-center mt-8">
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Pounds (lbs)</label>
             <input 
               type="number" 
               value={lbs} 
               onChange={(e) => setLbs(e.target.value)} 
               className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
           
           <div className="text-3xl font-bold text-zinc-300 dark:text-zinc-700 hidden md:block">=</div>
           
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Kilograms (kg)</label>
             <input 
               type="text" 
               readOnly 
               value={kg} 
               className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
         </div>
         <div className="text-sm text-zinc-500 pt-4">Formula: divide the mass value by 2.20462</div>
      </div>
    </div>
  );
}
