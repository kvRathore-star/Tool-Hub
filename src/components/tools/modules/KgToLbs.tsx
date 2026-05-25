"use client";
import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function KgToLbs() {
  const [kg, setKg] = useState<string>('1');
  const [lbs, setLbs] = useState<string>('');

  useEffect(() => {
    const val = parseFloat(kg);
    if (isNaN(val)) {
      setLbs('');
      return;
    }
    setLbs((val * 2.20462).toFixed(4).replace(/\.?0+$/, ''));
  }, [kg]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Scale className="w-8 h-8 text-orange-500" />
           <h2 className="text-2xl font-bold">Kg to Lbs Converter</h2>
         </div>
         <p className="text-zinc-500">Instantly convert Kilograms (kg) to Pounds (lbs).</p>
         
         <div className="flex flex-col md:flex-row items-center gap-6 justify-center mt-8">
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Kilograms (kg)</label>
             <input 
               type="number" 
               value={kg} 
               onChange={(e) => setKg(e.target.value)} 
               className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
           
           <div className="text-3xl font-bold text-zinc-300 dark:text-zinc-700 hidden md:block">=</div>
           
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Pounds (lbs)</label>
             <input 
               type="text" 
               readOnly 
               value={lbs} 
               className="p-4 rounded-xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
         </div>
         <div className="text-sm text-zinc-500 pt-4">Formula: multiply the mass value by 2.20462</div>
      </div>
    </div>
  );
}
