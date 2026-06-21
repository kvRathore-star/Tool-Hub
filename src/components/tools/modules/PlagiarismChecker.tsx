"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function PlagiarismChecker() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return toast.error('Enter text to check');
    if (!isConfigured) return toast.error('Configure AI Provider');

    setIsProcessing(true);
    try {
      const prompt = "You are an expert AI plagiarism detector. Analyze the following text and determine if it is human-written, AI-generated, or plagiarized from common sources. Provide a detailed breakdown and confidence score.\n\nText:\n" + inputText;
      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.3);
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
      <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()} placeholder="Paste text to check for plagiarism..." className="w-full h-48 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none" />
      <button onClick={handleGenerate} disabled={isProcessing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">{isProcessing ? <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                Checking...
              </> : 'Check Plagiarism'}</button>
      {outputText && <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">{outputText}</div>}
    </div>
  );
}