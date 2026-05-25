"use client";
import React, { useState, useEffect } from 'react';
import { Globe2 } from 'lucide-react';

export default function CstToEst() {
  const [cstTime, setCstTime] = useState<string>('12:00');
  const [estTime, setEstTime] = useState<string>('');

  useEffect(() => {
    if (!cstTime) {
      setEstTime('');
      return;
    }
    
    // CST is UTC-6, EST is UTC-5 (1 hour ahead of CST)
    const [hoursStr, minutes] = cstTime.split(':');
    let hours = parseInt(hoursStr);
    
    hours = (hours + 1) % 24;
    
    setEstTime(`${hours.toString().padStart(2, '0')}:${minutes}`);
  }, [cstTime]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Globe2 className="w-8 h-8 text-emerald-500" />
           <h2 className="text-2xl font-bold">CST to EST Converter</h2>
         </div>
         <p className="text-zinc-500">Quickly convert Central Standard Time (CST) to Eastern Standard Time (EST).</p>
         
         <div className="flex flex-col md:flex-row items-center gap-6 justify-center mt-8">
           <div className="text-left w-full md:w-auto">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">CST (Central Time)</label>
             <input 
               type="time" 
               value={cstTime} 
               onChange={(e) => setCstTime(e.target.value)} 
               className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-2xl font-bold outline-none w-full"
             />
           </div>
           
           <div className="text-3xl font-bold text-zinc-300 dark:text-zinc-700 hidden md:block">→</div>
           
           <div className="text-left w-full md:w-auto">
             <label className="text-sm font-semibold mb-2 block text-zinc-500">EST (Eastern Time)</label>
             <input 
               type="time" 
               readOnly 
               value={estTime} 
               className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-2xl font-bold outline-none w-full"
             />
           </div>
         </div>
         
         <div className="pt-6 text-sm text-zinc-500">
           EST is exactly 1 hour ahead of CST.
         </div>
      </div>
    </div>
  );
}
