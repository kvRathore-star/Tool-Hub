"use client";
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState(100);
  const [revenue, setRevenue] = useState(150);

  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <DollarSign className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Profit Margin Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cost of Goods ($)</label>
            <input type="number" value={cost} onChange={e => setCost(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Sale Revenue ($)</label>
            <input type="number" value={revenue} onChange={e => setRevenue(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-400">Gross Profit</span>
                <p className="text-xl font-bold text-zinc-850 dark:text-white">$${profit.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs text-zinc-400">Markup Percentage</span>
                <p className="text-xl font-bold text-emerald-500">${markup.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Gross Profit Margin</span>
            <p className="text-4xl font-extrabold text-emerald-500">${margin.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}