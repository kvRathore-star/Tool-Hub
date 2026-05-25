"use client";

import React, { useState } from 'react';
import { diff_match_patch } from 'diff-match-patch';
import { Columns, Split, ArrowLeftRight, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DiffChecker() {
  const [original, setOriginal] = useState('Type or paste original text here.\nThis line changes.\nGoodbye!');
  const [modified, setModified] = useState('Type or paste modified text here.\nThis line is changed.\nHello world!\nWelcome!');
  const [diffs, setDiffs] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDiffCheck = () => {
    setIsProcessing(true);
    try {
      const dmp = new diff_match_patch();
      const difference = dmp.diff_main(original, modified);
      dmp.diff_cleanupSemantic(difference);
      setDiffs(difference);
      toast.success('Text differences computed!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to compute differences.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setOriginal('');
    setModified('');
    setDiffs(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Split className="w-6 h-6 text-indigo-500" />
          Text Diff Checker
        </h2>
        <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
          Compare two versions of text side-by-side or inline to find additions, deletions, and modifications. Computed locally.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original panel */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Original Text</span>
            <textarea
              value={original}
              onChange={(e) => {
                setOriginal(e.target.value);
                setDiffs(null);
              }}
              placeholder="Paste the source version of your text..."
              className="w-full h-48 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-900 dark:text-white outline-none resize-none focus:border-indigo-500"
            />
          </div>

          {/* Modified panel */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Modified Text</span>
            <textarea
              value={modified}
              onChange={(e) => {
                setModified(e.target.value);
                setDiffs(null);
              }}
              placeholder="Paste the updated/modified version..."
              className="w-full h-48 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-900 dark:text-white outline-none resize-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDiffCheck}
            disabled={isProcessing}
            className="flex-1 bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-850 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {isProcessing ? 'Comparing Texts...' : 'Compare Text Diffs'}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-3.5 bg-zinc-105 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Diff result rendering */}
        {diffs && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Comparison Output
            </h3>

            <div className="p-5 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/5 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {diffs.map(([op, textVal], idx) => {
                if (op === 0) {
                  return <span key={idx} className="text-zinc-800 dark:text-zinc-300">{textVal}</span>;
                }
                if (op === 1) {
                  return (
                    <span 
                      key={idx} 
                      className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border-b border-emerald-500/35 px-1 py-0.5 rounded"
                      title="Added"
                    >
                      {textVal}
                    </span>
                  );
                }
                // Deletion
                return (
                  <span 
                    key={idx} 
                    className="bg-rose-500/20 text-rose-650 dark:text-rose-400 line-through font-bold border-b border-rose-500/35 px-1 py-0.5 rounded"
                    title="Deleted"
                  >
                    {textVal}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-4 text-[10px] text-zinc-500 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/30 rounded" />
                <span>Addition (Inserted)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-rose-500/20 border border-rose-500/30 rounded" />
                <span>Deletion (Removed)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}