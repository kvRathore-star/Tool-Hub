"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAiProvider } from '@/hooks/useAiProvider';
import AiSettings from '../AiSettings';
import { Clipboard, Download, Sparkles, GitBranch, ChevronDown, ChevronRight } from 'lucide-react';

interface MindMapNode {
  name: string;
  children: MindMapNode[];
}

export default function AiMindMapGenerator() {
  const { isConfigured, generateCompletion } = useAiProvider();
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('3 Levels');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode[]>([]);
  const [rawText, setRawText] = useState('');

  const parseTree = (text: string): MindMapNode[] => {
    const lines = text.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('+');
    });

    const root: MindMapNode[] = [];
    const stack: { indent: number; node: MindMapNode }[] = [];

    lines.forEach(line => {
      const indent = line.search(/\S/);
      const name = line.replace(/^\s*[-\*\+]\s*/, '').trim();
      if (!name) return;

      const node: MindMapNode = { name, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].node.children.push(node);
      }

      stack.push({ indent, node });
    });

    return root;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Please enter a central topic');
    if (!isConfigured) return toast.error('Please configure your AI Provider API key at the top first!');

    setIsProcessing(true);
    setMindMapData([]);
    setRawText('');
    try {
      const systemPrompt = "You are an expert structure organizer. Generate hierarchical mind maps in the form of a tabbed bullet list. Use only '-' for bullet items and tabs or spaces for indentation levels. Do not write any conversational preamble or explanations. Start directly with the root node.";
      const userPrompt = `Create a detailed mind map for the topic: "${topic}". Depth requirement: ${depth}. Format carefully as a structured bulleted list with correct indentation so it can be parsed.`;
      
      const response = await generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], 0.5);

      setRawText(response);
      const parsed = parseTree(response);
      
      if (parsed.length === 0) {
        // Fallback if formatting was strange
        setMindMapData([{ name: topic, children: [{ name: "Generated text format was invalid for tree parsing.", children: [] }] }]);
      } else {
        setMindMapData(parsed);
      }
      toast.success('Mind map successfully created!');
    } catch (e: any) {
      toast.error(e.message || "Failed to generate mind map");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    toast.success('Structured outline copied!');
  };

  const handleDownload = () => {
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Recursive renderer component for tree nodes
  const TreeNode = ({ node, depth = 0 }: { node: MindMapNode; depth: number }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const colors = [
      'border-purple-500 bg-purple-500/5 text-purple-700 dark:text-purple-300',
      'border-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-300',
      'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
      'border-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-300'
    ];
    const colorClass = colors[depth % colors.length];

    return (
      <div className="pl-6 relative border-l border-zinc-200 dark:border-zinc-800/80 my-2 ml-2">
        <div className="flex items-center gap-2 group">
          {hasChildren && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.01] ${colorClass}`}>
            {node.name}
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-200">
            {node.children.map((child, idx) => (
              <TreeNode key={idx} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <AiSettings />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <GitBranch className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Mind Map Generator</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Central Concept or Topic</label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Remote work team productivity, launching a web agency..."
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white h-44 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Detail Level</label>
              <select
                value={depth}
                onChange={e => setDepth(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="2 Levels (Basic outline)">2 Levels (Basic outline)</option>
                <option value="3 Levels (Standard mind map)">3 Levels (Standard mind map)</option>
                <option value="4 Levels (Detailed breakdown)">4 Levels (Detailed breakdown)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mapping Concept...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Mind Map</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Interactive Mind Map</h4>
            {mindMapData.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy Structured Outline"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDownload} 
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-auto max-h-[500px]">
            {mindMapData.length > 0 ? (
              <div className="p-4 bg-zinc-50 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-zinc-800/50">
                {mindMapData.map((rootNode, idx) => (
                  <div key={idx} className="my-2">
                    <div className="px-4 py-2 bg-purple-600 text-white rounded-lg inline-block text-sm font-bold shadow-md">
                      {rootNode.name}
                    </div>
                    {rootNode.children && rootNode.children.map((child, childIdx) => (
                      <TreeNode key={childIdx} node={child} depth={1} />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                <GitBranch className="w-10 h-10 mb-3 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <p className="text-sm font-medium">Your interactive mind map will branch out here.</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Specify your topic, then run the generator model.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
