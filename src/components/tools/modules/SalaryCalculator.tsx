"use client";
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);

  // Simple progressive standard income tax logic for simulation
  const calculateTax = (income: number) => {
    let taxable = Math.max(0, income - deductions);
    let tax = 0;
    
    if (taxable > 1500000) {
      tax += (taxable - 1500000) * 0.3 + 187500;
    } else if (taxable > 1200000) {
      tax += (taxable - 1200000) * 0.2 + 127500;
    } else if (taxable > 900000) {
      tax += (taxable - 900000) * 0.15 + 82500;
    } else if (taxable > 600000) {
      tax += (taxable - 600000) * 0.1 + 52500;
    } else if (taxable > 300000) {
      tax += (taxable - 300000) * 0.05;
    }
    
    return tax;
  };

  const tax = calculateTax(ctc);
  const netAnnual = ctc - tax;
  const netMonthly = netAnnual / 12;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Briefcase className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Salary Take-Home Calculator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Annual CTC / Salary (₹)</label>
            <input type="number" value={ctc} onChange={e => setCtc(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Annual Deductions / 80C (₹)</label>
            <input type="number" value={deductions} onChange={e => setDeductions(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none" />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase">Annual Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-400">Income Tax</span>
                <p className="text-lg font-bold text-rose-500">₹${Math.round(tax).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-xs text-zinc-400">Annual Take-Home</span>
                <p className="text-lg font-bold text-zinc-850 dark:text-zinc-150">₹${Math.round(netAnnual).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            <span className="text-xs text-zinc-400">Monthly Net Salary</span>
            <p className="text-3xl font-extrabold text-emerald-500">₹${Math.round(netMonthly).toLocaleString('en-IN')}/mo</p>
          </div>
        </div>
      </div>
    </div>
  );
}