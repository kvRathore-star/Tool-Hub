"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function CodeExplainer() {
  const { isConfigured, generateCompletion } = useAiProvider();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExplain = async () => {
    if (!inputText.trim()) {
      toast.error('Please paste some code to explain');
      return;
    }

    if (!isConfigured) {
      toast.error('Please configure your AI Provider first');
      return;
    }

    setIsProcessing(true);
    setOutputText('');

    try {
      const prompt = `You are a Senior Staff Software Engineer. Explain the following code snippet to a junior developer.
Provide a clear, high-level summary of what it does, followed by a breakdown of its key components. 
Keep the explanation structured, educational, and easy to read using markdown formatting.

Code Snippet:
\`\`\`
${inputText}
\`\`\``;

      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.2);
      setOutputText(response);
    } catch (e: any) {
      toast.error(e.message || "Explanation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <AiSettings />

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 ${!isConfigured ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
        
        {/* Left: Code Input */}
        <div className="flex flex-col bg-[#1e1e1e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl h-[600px]">
          <div className="bg-[#2d2d2d] px-4 py-3 flex justify-between items-center border-b border-black">
            <h3 className="font-mono font-bold text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-yellow-400">{'</>'}</span> input_code.ts
            </h3>
            <button 
              onClick={() => setInputText('')}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any confusing code block here (React, Python, Go, C++, etc.)..."
            className="flex-1 w-full p-6 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-zinc-300 placeholder:text-zinc-600"
            spellCheck="false"
          />
          <div className="p-4 bg-[#2d2d2d] border-t border-black">
             <button
               onClick={handleExplain}
               disabled={isProcessing || !inputText.trim()}
               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
             >
               {isProcessing ? 'Analyzing Code...' : 'Explain this Code'}
             </button>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl h-[600px]">
          <div className="bg-zinc-50 dark:bg-zinc-800/80 px-4 py-3 border-b border-zinc-200 dark:border-white/10">
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-xl">🧠</span> AI Explanation
            </h3>
          </div>
          <div className={`flex-1 w-full p-6 overflow-y-auto prose dark:prose-invert max-w-none ${isProcessing ? 'animate-pulse opacity-50' : ''}`}>
             {!outputText && !isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 opacity-50">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p>Paste code and click explain to see the breakdown.</p>
                </div>
             ) : (
                <div className="whitespace-pre-wrap">{outputText || "Generating explanation..."}</div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
