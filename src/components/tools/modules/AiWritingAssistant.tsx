"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function AIWritingAssistant() {
  const { isConfigured, generateCompletion } = useAiProvider();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isProcessing, setIsProcessing] = useState(false);

  const tones = ['Professional', 'Casual', 'Persuasive', 'Academic', 'Humorous', 'Empathetic', 'Direct'];

  const handleImprove = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to improve');
      return;
    }

    if (!isConfigured) {
      toast.error('Please configure your AI Provider first');
      return;
    }

    setIsProcessing(true);
    setOutputText('');

    try {
      const prompt = `You are an expert copywriter and editor. Please rewrite and improve the following text.
Make it sound more **${tone}**. Fix any grammatical errors and improve the vocabulary and flow.
Output ONLY the revised text without any conversational filler or formatting tags.

Original Text:
${inputText}`;

      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.6);
      setOutputText(response);
    } catch (e: any) {
      toast.error(e.message || "Rewrite failed");
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
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <AiSettings />

      <div className={`space-y-6 transition-all duration-300 ${!isConfigured ? 'opacity-50 pointer-events-none blur-[1px]' : ''}`}>
        
        {/* Controls */}
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl shadow-sm">
           <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Desired Tone:</label>
           <select 
             value={tone}
             onChange={(e) => setTone(e.target.value)}
             className="w-full sm:w-64 bg-zinc-50 dark:bg-zinc-800 border-none outline-none px-4 py-2.5 rounded-lg text-zinc-900 dark:text-zinc-100 font-medium appearance-none"
           >
             {tones.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your rough draft here..."
              className="w-full h-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 text-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none resize-none shadow-sm focus:border-emerald-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <textarea
              value={outputText}
              readOnly
              placeholder="Your polished text will appear here..."
              className={`w-full h-[400px] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 text-lg text-zinc-900 dark:text-white outline-none resize-none shadow-sm ${isProcessing ? 'animate-pulse text-zinc-400' : ''}`}
            />
            {outputText && (
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-white/10 p-2 rounded-lg shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors"
                aria-label="Copy"
              >
                <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleImprove}
          disabled={isProcessing || !inputText.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Improving Text...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Rewrite & Improve
            </>
          )}
        </button>

      </div>
    </div>
  );
}
