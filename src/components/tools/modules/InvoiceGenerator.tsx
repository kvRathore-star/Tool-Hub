"use client";
import React, { useState } from 'react';
export default function InvoiceGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
         <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Invoice Generator</h2>
         <p className="text-zinc-500">Generate PDF invoices for freelancers</p>
         <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
           <p className="text-center font-medium text-zinc-500">Basic calculator template generated.</p>
         </div>
      </div>
    </div>
  );
}