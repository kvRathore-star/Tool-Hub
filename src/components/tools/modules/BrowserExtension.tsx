"use client";

import React from 'react';
import { toast } from 'react-hot-toast';

export default function BrowserExtension() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 py-12 text-center">
      
      <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
        Coming Soon to Chrome & Edge
      </div>

      <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 max-w-3xl mx-auto leading-tight">
        Your All-in-One AI Sidebar
      </h2>
      
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-6">
        Highlight any text on the web to summarize, translate, or rewrite instantly. The full power of ToolHub inside your browser.
      </p>

      <div className="mt-12 max-w-md mx-auto">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-2 rounded-2xl flex shadow-2xl relative z-20">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent border-none outline-none px-4 text-zinc-900 dark:text-white"
          />
          <button 
            onClick={() => toast.success("Added to waitlist!")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Join Waitlist
          </button>
        </div>
        <p className="text-sm text-zinc-500 mt-4">Join 10,000+ others on the waitlist.</p>
      </div>

      {/* Decorative extension mockup */}
      <div className="mt-20 relative max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="bg-[#1e1e1e] border border-zinc-200 dark:border-white/10 rounded-t-3xl shadow-2xl overflow-hidden aspect-video relative">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-white/10 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-white/5 pb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">T</div>
              <span className="font-bold">ToolHub AI</span>
            </div>
            <div className="bg-zinc-50/50 dark:bg-black/50 rounded-xl p-3 text-sm text-zinc-700 dark:text-zinc-300">
              Summarize this page...
            </div>
            <div className="bg-blue-600/20 text-blue-400 rounded-xl p-3 text-sm">
              This page contains information about the upcoming ToolHub browser extension.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
