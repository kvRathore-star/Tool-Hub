"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';
import { Clipboard, Download, Sparkles, Network } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';

export default function AiFlowchartMaker() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('graph TD'); // Top-Down by default
  const [isProcessing, setIsProcessing] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');

  useEffect(() => {
    if (mermaidCode) {
      // Dynamically load and render mermaid
      import('mermaid').then((m) => {
        m.default.initialize({ 
          startOnLoad: true, 
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose'
        });
        m.default.contentLoaded();
      }).catch(err => {
        console.error("Failed to load mermaid.js", err);
      });
    }
  }, [mermaidCode]);

  const handleGenerate = async () => {
    if (!description.trim()) return toast.error('Please describe the process');
    if (!isConfigured) return toast.error('Please configure your AI Provider API key at the top first!');

    setIsProcessing(true);
    setMermaidCode('');
    try {
      const systemPrompt = "You are an expert system designer. Generate valid, clean Mermaid.js flowchart code based on user processes. Do not include markdown code block syntax (like ```mermaid or ```), just output the raw Mermaid graph code starting directly with graph TD or graph LR.";
      const userPrompt = `Create a flowchart representing this process: "${description}". Direction format: ${style}. Use clear labels, brackets for shapes (e.g. A[Label], B(Label), C{Decision}), and clean connections. Do not include any conversational introduction, just output the raw graph syntax.`;
      
      const response = await generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], 0.3);

      // Clean up output if the model wrapped it in code blocks anyway
      let cleaned = response.trim();
      if (cleaned.startsWith("```mermaid")) {
        cleaned = cleaned.substring(10);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      
      setMermaidCode(cleaned.trim());
      toast.success('Flowchart successfully generated!');
    } catch (e: any) {
      toast.error(e.message || "Failed to generate flowchart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode);
    toast.success('Mermaid code copied!');
  };

  const handleDownload = () => {
    const blob = new Blob([mermaidCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadOrShare(url, `flowchart_${new Date().toISOString().slice(0,10)}.mmd`);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Network className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Flowchart Maker</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Process Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                placeholder="e.g. Order checkout flow: User inputs payment -> validation check -> if valid, bill user & send receipt -> if invalid, show error message..."
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white h-44 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Flowchart Direction</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="graph TD">Vertical (Top to Bottom)</option>
                <option value="graph LR">Horizontal (Left to Right)</option>
                <option value="graph BT">Bottom to Top</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mapping Flowchart...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Flowchart</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Visual Flowchart</h4>
            {mermaidCode && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy Mermaid Code" aria-label="Copy"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownload} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Download Mermaid File" aria-label="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-auto max-h-[500px]">
            {mermaidCode ? (
              <div 
                key={mermaidCode} 
                className="mermaid flex items-center justify-center p-4 bg-zinc-50 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-zinc-800/50"
              >
                {mermaidCode}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                <Network className="w-10 h-10 mb-3 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <p className="text-sm font-medium">Your interactive flowchart will be drawn here.</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Specify your process, then run the generator model.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
