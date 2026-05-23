"use client";

import React, { useState } from 'react';

export default function AiParaphrasingTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const processData = () => {
    // Basic placeholder logic
    setOutput("This tool has been automatically generated and is ready for custom logic.\nInput was: " + input);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
        <strong>UI Ready:</strong> This module (AiParaphrasingTool) was auto-generated and is ready for business logic.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-white font-medium">Input</h4>
          <textarea 
            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white h-32 outline-none focus:border-blue-500"
            placeholder="Enter input here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            onClick={processData}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Process
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-white font-medium">Output</h4>
          <textarea 
            className="w-full bg-black border border-emerald-500/30 rounded-lg px-3 py-2 text-emerald-400 h-32 outline-none"
            readOnly
            value={output}
            placeholder="Output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
