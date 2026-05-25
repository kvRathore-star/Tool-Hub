"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';
import { Clipboard, Download, Sparkles } from 'lucide-react';

export default function AiBlogTitleGenerator() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputText, setOutputText] = useState('');
  
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Viral / Clickbait");
  const [quantity, setQuantity] = useState("10 titles");

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please fill in the Blog Topic or Focus Keywords field');
    if (!isConfigured) return toast.error('Please configure your AI Provider API key at the top first!');

    setIsProcessing(true);
    try {
      const prompt = `You are a digital marketing and SEO copywriting expert.\n\nGenerate ${quantity} high-performing blog post titles about: ${topic}. Tone/Style: ${tone}. Ensure they are optimized for SEO and click-through rate.`;
      const response = await generateCompletion([{ role: 'user', content: prompt }], 0.8);
      setOutputText(response);
      toast.success('Successfully generated!');
    } catch (e: any) {
      toast.error(e.message || "Failed to generate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "blog_titles_" + new Date().toISOString().slice(0,10) + ".txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Blog Title Generator</h3>
            </div>
            
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">Generate viral, SEO-friendly blog post titles.</p>
            
<div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Blog Topic or Focus Keywords</label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., Artificial intelligence in agriculture, hydroponic farming tips..."
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white h-32 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title Style / Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="Viral / Clickbait">Viral / Clickbait</option>
                <option value="How-To / Educational">How-To / Educational</option>
                <option value="Listicle (e.g. X Ways...)">Listicle (e.g. X Ways...)</option>
                <option value="Question-Based">Question-Based</option>
                <option value="Sleek & Professional">Sleek & Professional</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Number of Titles</label>
              <select
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="5 titles">5 titles</option>
                <option value="10 titles">10 titles</option>
                <option value="15 titles">15 titles</option>
                <option value="20 titles">20 titles</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Brainstorming...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Titles</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Generated Output</h4>
            {outputText && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy to Clipboard"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownload} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Download as File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {outputText ? (
              <pre className="flex-1 p-4 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-y-auto max-h-[500px]">
                {outputText}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                <Sparkles className="w-8 h-8 mb-3 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <p className="text-sm font-medium">Your generated content will appear here.</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Configure your API key and click generate to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
