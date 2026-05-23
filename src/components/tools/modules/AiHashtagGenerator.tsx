"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AiHashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const generateHashtags = () => {
    if (!topic.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setOutput(`#${topic.replace(/\\s+/g, '')} #trending #viral #fyp #explore #contentcreator \
\
(API Stub: Connect Claude/OpenAI for semantic hashtags)`);
      setIsProcessing(false);
      toast.error("API Key Missing");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="text-zinc-900 dark:text-white font-medium">Post Description</h4>
          <textarea 
            className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-zinc-900 dark:text-white h-32 outline-none focus:border-purple-500"
            placeholder="Describe your Instagram or TikTok post..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button 
            onClick={generateHashtags}
            disabled={isProcessing || !topic}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "Analyzing..." : "Generate Hashtags"}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Hashtags</h4>
          <textarea 
            className="flex-1 w-full bg-white dark:bg-black border border-purple-500/30 rounded-lg px-4 py-3 text-purple-400 font-medium outline-none resize-none min-h-[200px]"
            readOnly
            value={output}
            placeholder="Tags will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
