"use client";
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [type, setType] = useState('add'); // add or remove

  const gstAmount = type === 'add' 
    ? amount * (rate / 100) 
    : amount - (amount / (1 + rate / 100));

  const total = type === 'add' 
    ? amount + gstAmount 
    : amount;

  const originalAmount = type === 'add' 
    ? amount 
    : amount - gstAmount;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Calculator className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">GST Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Base Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">GST Rate (%)</label>
              <select value={rate} onChange={e => setRate(parseInt(e.target.value))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none">
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Calculation Action</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none">
                <option value="add">Add GST (+)</option>
                <option value="remove">Remove GST (-)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase">GST Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-400">Net Amount</span>
                <p className="text-lg font-bold text-zinc-850 dark:text-zinc-150">₹${originalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs text-zinc-400">GST Value (${rate}%)</span>
                <p className="text-lg font-bold text-emerald-500">₹${gstAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Total Price</span>
            <p className="text-3xl font-extrabold text-emerald-500">₹${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}