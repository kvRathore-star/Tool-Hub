"use client";

import React, { useState } from 'react';
import { Clipboard, Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
// @ts-ignore
import TurndownService from 'turndown';

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');

  const convertHtmlToMarkdown = () => {
    if (!html.trim()) {
      setMarkdown('');
      return;
    }

    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });
      const md = turndownService.turndown(html);
      setMarkdown(md);
      toast.success('Successfully converted HTML to Markdown!');
    } catch (err: any) {
      toast.error('Failed to parse HTML string.');
    }
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    toast.success('Copied Markdown!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          HTML to Markdown Converter
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Convert HTML markup tags into clean, human-readable standard Markdown syntax offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <span className="text-xs text-zinc-400 font-bold uppercase block">HTML Content Input</span>
          <textarea
            value={html}
            onChange={e => setHtml(e.target.value)}
            placeholder="e.g. <h1>Title</h1><p>This is a <strong>paragraph</strong>.</p>..."
            className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white font-mono h-64 outline-none text-xs resize-none"
          />
          <button onClick={convertHtmlToMarkdown} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Convert to Markdown
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 font-bold uppercase">Markdown Output</span>
              {markdown && (
                <button onClick={handleCopy} className="p-1.5 text-zinc-500 hover:text-white border border-zinc-800 rounded-lg" aria-label="Copy"><Copy className="w-4 h-4" /></button>
              )}
            </div>
            <textarea
              value={markdown}
              readOnly
              placeholder="Markdown output syntax will appear here..."
              className="w-full flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white font-mono h-64 outline-none text-xs resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}