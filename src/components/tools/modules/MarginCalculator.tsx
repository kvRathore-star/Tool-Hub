"use client";
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function MarginCalculator() {
  const [cost, setCost] = useState(100);
  const [margin, setMargin] = useState(30); // in percent

  const revenue = cost / (1 - margin / 100);
  const profit = revenue - cost;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <DollarSign className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Margin Cost Pricing Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Item Cost ($)</label>
            <input type="number" value={cost} onChange={e => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Target Margin (%)</label>
            <input type="number" value={margin} onChange={e => setMargin(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-zinc-400">Total Profit</span>
              <p className="text-xl font-bold text-emerald-500">$${profit.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Target Selling Price</span>
            <p className="text-4xl font-extrabold text-emerald-500">$${revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}