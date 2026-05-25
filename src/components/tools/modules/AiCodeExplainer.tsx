"use client";

import React, { useState } from 'react';
import { Sparkles, Clipboard, Download, HelpCircle, Code } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function AiCodeExplainer() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const explainCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to explain');
      return;
    }

    if (!isConfigured) {
      toast.error('Please configure your AI Provider API key at the top first!');
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `You are an expert senior software engineer. Explain the following code step-by-step. Break down its logic, purpose, potential edge cases, and runtime complexity.
      
Code:
${code}`;

      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.3);
      setExplanation(response);
      toast.success('Explanation generated!');
    } catch (e: any) {
      toast.error(e.message || "Failed to explain");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    toast.success('Copied explanation!');
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Code className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Code Explainer</h3>
            </div>
            
            <p className="text-xs text-zinc-450 mb-4">Paste complex scripts or logical algorithms to generate step-by-step breakdowns of implementation flows.</p>
            
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste code snippet here..."
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white font-mono h-80 outline-none text-xs resize-none"
            />
          </div>

          <button 
            onClick={explainCode}
            disabled={isProcessing}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-indigo-650 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Explaining...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Explain Code</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Logical Breakdown</h4>
            {explanation && (
              <button 
                onClick={handleCopy} 
                className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                title="Copy to Clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {explanation ? (
              <div className="flex-1 p-4 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-zinc-800/50 text-zinc-850 dark:text-zinc-200 whitespace-pre-wrap font-sans text-xs leading-relaxed overflow-y-auto max-h-[500px]">
                {explanation}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                <HelpCircle className="w-8 h-8 mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm font-medium">Logical breakdown explanation will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
