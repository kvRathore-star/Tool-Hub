"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function ArticleSummarizer() {
  const { isConfigured, generateCompletion } = useAiProvider();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [length, setLength] = useState('Short (Bullet Points)');
  const [isProcessing, setIsProcessing] = useState(false);

  const lengths = [
    'Short (Bullet Points)', 
    'Medium (1 Paragraph)', 
    'Detailed (Detailed Outline)', 
    'Executive Summary'
  ];

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter an article or text to summarize');
      return;
    }

    if (!isConfigured) {
      toast.error('Please configure your AI Provider first');
      return;
    }

    setIsProcessing(true);
    setOutputText('');

    try {
      const prompt = `You are a highly skilled analyst. Read the following text and provide a summary.
The summary format should be: ${length}.
Focus on the most important facts, key arguments, and conclusions. Do not hallucinate external information.
Do not output conversational text, just output the summary directly.

Article Text:
${inputText}`;

      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.2);
      setOutputText(response);
    } catch (e: any) {
      toast.error(e.message || "Summarization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <AiSettings />

      <div className={`space-y-6 transition-all duration-300 ${!isConfigured ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-6 border-b border-zinc-200 dark:border-white/10 space-y-4">
             <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Paste Article Text</label>
             <textarea
               value={inputText}
               onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSummarize()}
               placeholder="Paste a long article, document, or essay here..."
               className="w-full h-[250px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none resize-none focus:border-indigo-500 transition-colors"
             />
             
             <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Summary Type:</label>
                <select 
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none px-4 py-2.5 rounded-lg text-zinc-900 dark:text-zinc-100 font-medium appearance-none"
                >
                  {lengths.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
             
             <button
               onClick={handleSummarize}
               disabled={isProcessing || !inputText.trim()}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
             >
               {isProcessing ? (
                 <>
                   <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Analyzing Text...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   Generate Summary
                 </>
               )}
             </button>
          </div>

          {(outputText || isProcessing) && (
            <div className="p-6 bg-zinc-50 dark:bg-black/50 relative">
               <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 AI Summary
               </h3>
               <div className={`prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap ${isProcessing ? 'animate-pulse opacity-50' : ''}`}>
                 {outputText || "Thinking..."}
               </div>
               
               {outputText && (
                 <button 
                   onClick={copyToClipboard}
                   className="mt-6 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Copy Summary
                 </button>
               )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
