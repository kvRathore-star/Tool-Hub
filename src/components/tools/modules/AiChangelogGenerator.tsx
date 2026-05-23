"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AiChangelogGenerator() {
  const [commits, setCommits] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const generateChangelog = () => {
    if (!commits.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setOutput(`# Release Notes v1.0.0\
\
## ✨ New Features\
- AI integration stub\
\
## 🐛 Bug Fixes\
- Fixed minor UI glitches\
\
(API Stub: Connect Claude/OpenAI for semantic generation from git commits)`);
      setIsProcessing(false);
      toast.error("API Key Missing");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-white font-medium">Git Commits / PR Titles</h4>
          <textarea 
            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-3 text-white h-48 outline-none focus:border-emerald-500 font-mono text-sm"
            placeholder="Paste your git log or commit messages here..."
            value={commits}
            onChange={e => setCommits(e.target.value)}
          />
          <button 
            onClick={generateChangelog}
            disabled={isProcessing || !commits}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "Writing Changelog..." : "Generate Release Notes"}
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-medium">Markdown Output</h4>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success('Copied to clipboard');
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Copy
            </button>
          </div>
          <textarea 
            className="flex-1 w-full bg-black border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 font-mono text-sm outline-none resize-none min-h-[250px]"
            readOnly
            value={output}
            placeholder="Markdown release notes will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
