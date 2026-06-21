"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function TextSummarizer() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return toast.error('Enter text to summarize');
    if (!isConfigured) return toast.error('Configure AI Provider');

    setIsProcessing(true);
    try {
      const prompt = "You are an expert analyst. Summarize the following text concisely. Provide a 1-paragraph high-level overview followed by 3-5 bullet points of key takeaways.\n\nText:\n" + inputText;
      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.5);
      setOutputText(response);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()} placeholder="Paste long text to summarize..." className="w-full h-96 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none" />
        <textarea value={outputText} readOnly placeholder="Summary will appear here..." className="w-full h-96 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none" />
      </div>
      <button onClick={handleGenerate} disabled={isProcessing} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">{isProcessing ? <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                Summarizing...
              </> : 'Summarize Text'}</button>
    </div>
  );
}