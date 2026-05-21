"use client";

import React, { useState } from 'react';

export default function UniversalTransformer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    // Generic fallback logic - realistically this would switch(toolMetadata.slug)
    setTimeout(() => {
      try {
        // Fallback demo processing: reverse string as a placeholder
        setOutput(input.split('').reverse().join(''));
      } catch (e) {
        setOutput("Error processing input data.");
      }
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm flex gap-3 items-start mb-6">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <strong>Fallback Template Active: </strong> <code className="bg-black/30 px-1.5 py-0.5 rounded ml-1 text-xs text-blue-300">UniversalTransformer.tsx</code>
            <p className="mt-1 text-blue-500/80">This tool operates on generic input/output logic. Specific parsing schemas may not apply.</p>
          </div>
        </div>
      
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Input Data</label>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          placeholder="Paste your text, code, or data here..."
        />
      </div>

      <button 
        onClick={handleProcess}
        disabled={!input || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Execute Pipeline"}
      </button>

      {output && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <label className="block text-sm font-medium text-zinc-400 mb-2 mt-2">Output Result</label>
          <div className="relative">
            <textarea 
              readOnly
              value={output}
              className="w-full h-40 bg-black border border-emerald-500/30 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            />
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-xs font-semibold"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
