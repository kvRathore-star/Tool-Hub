"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AiBlogTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const generateTitles = () => {
    if (!topic.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setOutput(`1. 10 Proven Strategies for ${topic}\
2. The Ultimate Guide to ${topic} in 2024\
3. Why ${topic} is the Future\
4. 5 Common Mistakes with ${topic}\
5. Everything You Need to Know About ${topic}\
\
(API Stub: Please connect OpenAI for better semantic results)`);
      setIsProcessing(false);
      toast.error("API Key Missing");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-zinc-900 dark:text-white font-medium">Topic or Keywords</h4>
          <textarea 
            className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-zinc-900 dark:text-white h-32 outline-none focus:border-blue-500"
            placeholder="e.g. Remote work productivity, Machine learning basics..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button 
            onClick={generateTitles}
            disabled={isProcessing || !topic}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "Brainstorming..." : "Generate Viral Titles"}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Generated Titles</h4>
          <textarea 
            className="flex-1 w-full bg-white dark:bg-black border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 outline-none resize-none min-h-[200px]"
            readOnly
            value={output}
            placeholder="Viral blog titles will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
