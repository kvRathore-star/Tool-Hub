"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function AiContentHumanizer() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return toast.error('Enter text to humanize');
    if (!isConfigured) return toast.error('Configure AI Provider');

    setIsProcessing(true);
    try {
      const prompt = "You are a professional editor. Rewrite the following text to completely bypass AI detection. Ensure the tone is natural, human-like, contains varied sentence structures, and reads conversationally.\n\nText:\n" + inputText;
      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.8);
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
        <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste AI generated text here..." className="w-full h-96 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none" />
        <textarea value={outputText} readOnly placeholder="Humanized text will appear here..." className="w-full h-96 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none" />
      </div>
      <button onClick={handleGenerate} disabled={isProcessing} className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl">{isProcessing ? 'Humanizing...' : 'Humanize Content'}</button>
    </div>
  );
}