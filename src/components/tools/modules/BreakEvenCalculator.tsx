"use client";
import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(10000);
  const [variableCost, setVariableCost] = useState(20);
  const [sellingPrice, setSellingPrice] = useState(50);

  const contributionMargin = sellingPrice - variableCost;
  const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
  const breakEvenSales = breakEvenUnits * sellingPrice;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Break-Even Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Fixed Costs ($)</label>
            <input type="number" value={fixedCosts} onChange={e => setFixedCosts(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Unit Variable Cost ($)</label>
              <input type="number" value={variableCost} onChange={e => setVariableCost(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Unit Selling Price ($)</label>
              <input type="number" value={sellingPrice} onChange={e => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-400">Contribution Margin</span>
                <p className="text-lg font-bold text-zinc-850 dark:text-white">{contributionMargin.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs text-zinc-400">Break-Even Units</span>
                <p className="text-lg font-bold text-indigo-500">{Math.ceil(breakEvenUnits).toLocaleString()} units</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Break-Even Sales Volume</span>
            <p className="text-3xl font-extrabold text-indigo-500">{Math.round(breakEvenSales).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}