"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';
import { Clipboard, Download, Sparkles } from 'lucide-react';

export default function AiStoryGenerator() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputText, setOutputText] = useState('');
  
  const [premise, setPremise] = useState("");
  const [genre, setGenre] = useState("Science Fiction");
  const [tone, setTone] = useState("Suspenseful");
  const [length, setLength] = useState("Medium (approx. 700 words)");

  const handleGenerate = async () => {
    if (!premise.trim()) return toast.error('Please fill in the Story Premise or Characters field');
    if (!isConfigured) return toast.error('Please configure your AI Provider API key at the top first!');

    setIsProcessing(true);
    try {
      const prompt = `You are a creative author. Write engaging, high-quality stories with vivid descriptions.\n\nWrite a ${length} story of genre ${genre} with a ${tone} tone based on this premise: ${premise}.`;
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
    link.download = "story_" + new Date().toISOString().slice(0,10) + ".txt";
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
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Story Generator</h3>
            </div>
            
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">Write creative stories and plots in any genre and tone.</p>
            
<div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Story Premise or Characters</label>
              <textarea
                value={premise}
                onChange={e => setPremise(e.target.value)}
                placeholder="e.g., A time-traveling historian accidentally gets stuck in ancient Rome with a modern smartphone..."
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white h-32 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Genre</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery/Thriller">Mystery/Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Horror">Horror</option>
                <option value="Historical Fiction">Historical Fiction</option>
                <option value="Comedy">Comedy</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="Suspenseful">Suspenseful</option>
                <option value="Dramatic">Dramatic</option>
                <option value="Humorous">Humorous</option>
                <option value="Dark">Dark</option>
                <option value="Mysterious">Mysterious</option>
                <option value="Whimsical">Whimsical</option>
                <option value="Epic">Epic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Story Length</label>
              <select
                value={length}
                onChange={e => setLength(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="Short (approx. 300 words)">Short (approx. 300 words)</option>
                <option value="Medium (approx. 700 words)">Medium (approx. 700 words)</option>
                <option value="Long (approx. 1200 words)">Long (approx. 1200 words)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Writing Story...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Story</span>
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
