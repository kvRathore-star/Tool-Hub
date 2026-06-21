"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function PromptLibraryGenerator() {
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const generatePrompt = () => {
    if (!topic.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setOutput(`Act as a senior expert in ${topic}. Your goal is to help me achieve optimal results. Please format your response using markdown. Provide 3 unique perspectives on ${topic}.\
\
(API Stub: Connect Claude/OpenAI for semantic generation)`);
      setIsProcessing(false);
      toast.error("API Key Missing");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-zinc-900 dark:text-white font-medium">Prompt Goal</h4>
          <textarea 
            className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-zinc-900 dark:text-white h-32 outline-none focus:border-indigo-500"
            placeholder="Describe what you want the AI to do (e.g. Write a sales email, explain quantum physics...)"
            value={topic}
            onChange={e => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && generatePrompt()}
          />
          <button 
            onClick={generatePrompt}
            disabled={isProcessing || !topic}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" /> Engineering...</> : "Generate Mega-Prompt"}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Engineered Prompt</h4>
          <textarea 
            className="flex-1 w-full bg-white dark:bg-black border border-indigo-500/30 rounded-lg px-4 py-3 text-indigo-300 font-medium outline-none resize-none min-h-[200px]"
            readOnly
            value={output}
            placeholder="Optimized prompt will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
