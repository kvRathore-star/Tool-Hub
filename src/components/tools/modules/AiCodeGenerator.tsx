"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AiCodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const generateCode = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    
    toast("Sending prompt to AI... Note: Backend is not connected.", { icon: '⏳' });
    
    setTimeout(() => {
      setOutput(`// (API Stub) Generated ${language} code for: ${prompt}\
\
function stub() {\
  console.log("Please configure OpenAI/Claude API keys.");\
}`);
      setIsProcessing(false);
      toast.error("API Key Missing.");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-medium">Requirements</h4>
            <textarea 
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-zinc-900 dark:text-white h-40 outline-none focus:border-purple-500"
              placeholder="Describe what you want the code to do..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mt-4 mb-2">Target Language</label>
            <select 
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none"
            >
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="php">PHP</option>
            </select>

            <button 
              onClick={generateCode}
              disabled={isProcessing || !prompt.trim()}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Generating..." : "Generate Code"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#1e1e1e] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl h-full flex flex-col overflow-hidden min-h-[400px]">
            <div className="flex px-4 py-2 bg-[#2d2d2d] border-b border-zinc-200 dark:border-white/5 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <textarea 
              className="flex-1 w-full bg-transparent text-emerald-400 p-6 font-mono text-sm outline-none resize-none"
              readOnly
              value={output}
              placeholder="// AI generated code will appear here"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
