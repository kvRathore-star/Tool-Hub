"use client";
import React, { useState } from 'react';
import { Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { isValidIBAN } from 'ibantools';

export default function IbanValidator() {
  const [iban, setIban] = useState('');
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);

  const validate = () => {
    setChecked(true);
    // Use ibantools package validation
    const formatted = iban.replace(/\s+/g, '').toUpperCase();
    setValid(isValidIBAN(formatted));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">IBAN Validator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">International Bank Account Number (IBAN)</label>
            <input 
              type="text" 
              value={iban} 
              onChange={e => {
                setIban(e.target.value);
                setChecked(false);
              }} 
              placeholder="e.g. GB29 NWBK 6016 1331 9268 19" 
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm outline-none focus:border-zinc-300 dark:focus:border-zinc-700" 
            />
          </div>

          <button 
            onClick={validate}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-colors"
          >
            Validate IBAN
          </button>
        </div>

        <div className="bg-zinc-50 dark:bg-black/30 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center items-center min-h-[180px]">
          {checked ? (
            valid ? (
              <div className="text-center space-y-2 animate-in zoom-in-95">
                <div className="p-3 bg-emerald-500 text-white rounded-full inline-block">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-emerald-500">Valid IBAN</h4>
                <p className="text-xs text-[var(--text-muted)]">The account format and checksum calculations are correct.</p>
              </div>
            ) : (
              <div className="text-center space-y-2 animate-in zoom-in-95">
                <div className="p-3 bg-rose-500 text-white rounded-full inline-block">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-rose-500">Invalid IBAN</h4>
                <p className="text-xs text-[var(--text-muted)]">Format checksum check failed. Please verify and retype.</p>
              </div>
            )
          ) : (
            <div className="text-center text-zinc-400">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-700 animate-pulse" />
              <p className="text-sm">Status display is idle.</p>
              <p className="text-xs text-zinc-500">Enter bank account details and validate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}