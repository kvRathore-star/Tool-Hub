"use client";
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const UNITS = {
  Millisecond: 1,
  Second: 1000,
  Minute: 60000,
  Hour: 3600000,
  Day: 86400000,
  Week: 604800000,
  Month: 2629800000,
  Year: 31557600000,
};

export default function TimeConverter() {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<keyof typeof UNITS>('Hour');
  const [toUnit, setToUnit] = useState<keyof typeof UNITS>('Minute');
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult('');
      return;
    }
    const inMilliseconds = num * UNITS[fromUnit];
    const converted = inMilliseconds / UNITS[toUnit];
    
    // Format to avoid extremely long decimals
    setResult(Number.isInteger(converted) ? converted.toString() : converted.toFixed(6).replace(/\.?0+$/, ''));
  }, [value, fromUnit, toUnit]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Clock className="w-8 h-8 text-sky-500" />
           <h2 className="text-2xl font-bold">Time Converter</h2>
         </div>
         <p className="text-zinc-500">Convert between seconds, minutes, hours, days, and more.</p>
         
         <div className="grid md:grid-cols-2 gap-6 text-left">
           <div className="space-y-2">
             <label className="text-sm font-semibold">From</label>
             <div className="flex bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
               <input 
                 type="number" 
                 value={value} 
                 onChange={(e) => setValue(e.target.value)} 
                 className="w-full bg-transparent p-4 outline-none"
               />
               <select 
                 value={fromUnit} 
                 onChange={(e) => setFromUnit(e.target.value as keyof typeof UNITS)}
                 className="bg-zinc-100 dark:bg-zinc-900 px-4 border-l border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
               >
                 {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}s</option>)}
               </select>
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-sm font-semibold">To</label>
             <div className="flex bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
               <input 
                 type="text" 
                 readOnly 
                 value={result} 
                 className="w-full bg-transparent p-4 outline-none font-bold text-sky-600 dark:text-sky-400"
               />
               <select 
                 value={toUnit} 
                 onChange={(e) => setToUnit(e.target.value as keyof typeof UNITS)}
                 className="bg-zinc-100 dark:bg-zinc-900 px-4 border-l border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer"
               >
                 {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}s</option>)}
               </select>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
