"use client";
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function VatCalculator() {
  const [netPrice, setNetPrice] = useState(100);
  const [vatRate, setVatRate] = useState(15);

  const vatAmount = netPrice * (vatRate / 100);
  const grossPrice = netPrice + vatAmount;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <DollarSign className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">VAT Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Net Price / Pre-tax ($)</label>
            <input type="number" value={netPrice} onChange={e => setNetPrice(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">VAT Rate (%)</label>
            <input type="number" value={vatRate} onChange={e => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-zinc-400">VAT Amount</span>
              <p className="text-xl font-bold text-zinc-850 dark:text-white">$${vatAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Gross Price (Inclusive)</span>
            <p className="text-4xl font-extrabold text-emerald-500">$${grossPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}