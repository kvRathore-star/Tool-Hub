"use client";
import React, { useState, useEffect } from 'react';
import { Ruler } from 'lucide-react';

export default function FeetToMeters() {
  const [feet, setFeet] = useState<string>('1');
  const [meters, setMeters] = useState<string>('');

  useEffect(() => {
    const val = parseFloat(feet);
    if (isNaN(val)) {
      setMeters('');
      return;
    }
    setMeters((val / 3.28084).toFixed(4).replace(/\.?0+$/, ''));
  }, [feet]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Ruler className="w-8 h-8 text-teal-500" />
           <h2 className="text-2xl font-bold">Feet to Meters Converter</h2>
         </div>
         <p className="text-zinc-500">Instantly convert length from Feet (ft) to Meters (m).</p>
         
         <div className="flex flex-col md:flex-row items-center gap-6 justify-center mt-8">
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Feet (ft)</label>
             <input 
               type="number" 
               value={feet} 
               onChange={(e) => setFeet(e.target.value)} 
               className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
           
           <div className="text-3xl font-bold text-zinc-300 dark:text-zinc-700 hidden md:block">=</div>
           
           <div className="text-left w-full md:w-auto flex-1">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">Meters (m)</label>
             <input 
               type="text" 
               readOnly 
               value={meters} 
               className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-2xl font-bold outline-none w-full text-center"
             />
           </div>
         </div>
         <div className="text-sm text-zinc-500 pt-4">Formula: divide the length value by 3.28084</div>
      </div>
    </div>
  );
}
