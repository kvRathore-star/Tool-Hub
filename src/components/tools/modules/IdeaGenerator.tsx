"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function IdeaGenerator() {
  const { isConfigured, generateCompletion } = useAiProvider();
  
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Business Startups');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    'Business Startups',
    'YouTube Video Ideas',
    'Blog Post Topics',
    'App / SaaS Ideas',
    'Marketing Campaigns',
    'Creative Writing Prompts',
    'Gift Ideas'
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a core topic or keyword');
      return;
    }

    if (!isConfigured) {
      toast.error('Please configure your AI Provider first');
      return;
    }

    setIsProcessing(true);
    setOutputText('');

    try {
      const prompt = `You are a highly creative brainstorming assistant. Generate a list of 10 highly creative, actionable, and unique ideas for the category: "${category}".
The ideas should revolve strictly around this core topic/keyword: "${topic}".
Output a well-formatted markdown list. Provide a catchy title for each idea and a 1-2 sentence explanation.

Topic: ${topic}
Category: ${category}`;

      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.9);
      setOutputText(response);
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
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
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
          
          <div className="text-center space-y-2 mb-8">
             <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-2">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Brainstorming & Idea Generator</h2>
             <p className="text-zinc-500 dark:text-zinc-400">Generate 10 highly creative ideas based on any keyword instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition-colors"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Core Topic or Keyword</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. AI Fitness, Vegan Baking, Dog Toys..."
                  className="w-full bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors"
                />
             </div>
          </div>
             
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !topic.trim()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Brainstorming...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate 10 Ideas
              </>
            )}
          </button>
        </div>

        {(outputText || isProcessing) && (
          <div className="bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-8 relative shadow-lg">
             <h3 className="font-bold text-amber-600 dark:text-amber-500 mb-6 flex items-center gap-2 text-lg border-b border-amber-200 dark:border-amber-900/50 pb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
               Your Generated Ideas
             </h3>
             <div className={`prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap ${isProcessing ? 'animate-pulse opacity-50' : ''}`}>
               {outputText || "Generating brilliant ideas..."}
             </div>
             
             {outputText && (
               <button 
                 onClick={copyToClipboard}
                 className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 Copy All Ideas
               </button>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
