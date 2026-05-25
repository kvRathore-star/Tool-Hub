"use client";
import React, { useState } from 'react';
import { Target } from 'lucide-react';

export default function CpmCalculator() {
  const [cost, setCost] = useState(500);
  const [impressions, setImpressions] = useState(100000);

  const cpm = impressions > 0 ? (cost / impressions) * 1000 : 0;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Target className="w-5 h-5 text-violet-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">CPM (Cost Per Mille) Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Ad Campaign Cost ($)</label>
            <input type="number" value={cost} onChange={e => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Ad Impressions Delivered</label>
            <input type="number" value={impressions} onChange={e => setImpressions(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center items-center min-h-[160px]">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Cost Per 1,000 Views (CPM)</span>
          <p className="text-5xl font-extrabold text-violet-500">${cpm.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}