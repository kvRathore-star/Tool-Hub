"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      toast.error('Please select at least one character type.');
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy password.');
    }
  };

  // Calculate strength visually
  const getStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length >= 12) score++;
    if (includeUppercase && includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score < 2) return { label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { label: 'Medium', color: 'bg-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
        <strong>100% Client-Side:</strong> Passwords are generated securely in your browser using the Web Crypto API. They are never sent to a server.
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Password Display */}
          <div>
            <div className="flex items-center bg-black border border-white/10 rounded-2xl p-4 overflow-hidden group">
              <input 
                type="text" 
                value={password}
                readOnly
                className="w-full bg-transparent text-white text-2xl sm:text-3xl font-mono tracking-wider outline-none selection:bg-blue-500/30"
              />
              <div className="flex gap-2">
                <button 
                  onClick={generatePassword}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
                  title="Generate New"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                  title="Copy"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                </button>
              </div>
            </div>

            {/* Strength indicator */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Password Strength:</span>
                <span className={`font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
              </div>
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full ${i <= (strength.label === 'Weak' ? 2 : strength.label === 'Medium' ? 3 : 5) ? strength.color : 'bg-zinc-800'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Controls */}
          <div className="space-y-6">
            
            {/* Length Slider */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-zinc-300">Password Length</label>
                <span className="text-blue-400 font-bold text-lg">{length}</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="64" 
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-black border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={includeUppercase} 
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <span className="text-zinc-300 select-none flex-1">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-black border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={includeLowercase} 
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <span className="text-zinc-300 select-none flex-1">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-black border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={includeNumbers} 
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <span className="text-zinc-300 select-none flex-1">Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-black border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={includeSymbols} 
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <span className="text-zinc-300 select-none flex-1">Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
