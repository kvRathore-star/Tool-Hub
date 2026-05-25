"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';

export default function AiEssayWriter() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [topic, setTopic] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic');
    if (!isConfigured) return toast.error('Configure AI Provider');

    setIsProcessing(true);
    try {
      const prompt = "Write a comprehensive, highly-detailed 5-paragraph academic essay on the following topic. Ensure it has a strong introduction, 3 well-supported body paragraphs, and a conclusive summary.\n\nTopic:\n" + topic;
      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.7);
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
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl">
        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Essay Topic</label>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The Impact of Artificial Intelligence on Modern Healthcare..." className="w-full bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-3 outline-none" />
      </div>
      <button onClick={handleGenerate} disabled={isProcessing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">{isProcessing ? 'Writing...' : 'Generate Essay'}</button>
      {outputText && <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">{outputText}</div>}
    </div>
  );
}