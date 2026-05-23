"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function GstInvoiceGenerator() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = () => {
    setIsProcessing(true);
    toast("Generating PDF... Note: Connect to backend for real generation.");
    setTimeout(() => {
      toast.error("PDF engine not connected.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-sm">
        <strong>India Finance Tool:</strong> Generate 100% compliant GST Invoices in seconds.
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-medium">Biller Details</h4>
            <input type="text" placeholder="Company Name" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500" />
            <input type="text" placeholder="GSTIN" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 uppercase" />
          </div>
          
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-medium">Client Details</h4>
            <input type="text" placeholder="Client Name" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500" />
            <input type="text" placeholder="Client GSTIN (Optional)" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 uppercase" />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-white/5">
          <h4 className="text-zinc-900 dark:text-white font-medium">Line Items</h4>
          <div className="flex gap-4 items-center">
            <input type="text" placeholder="Item Description" className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500" />
            <input type="number" placeholder="₹ Price" className="w-32 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500" />
            <select className="w-24 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500">
              <option value="18">18%</option>
              <option value="12">12%</option>
              <option value="5">5%</option>
              <option value="28">28%</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? "Generating PDF..." : "Download GST Invoice (PDF)"}
        </button>
      </div>
    </div>
  );
}
