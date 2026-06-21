"use client";

import React, { useState } from 'react';
import { Copy, Check, Download, Sliders, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { downloadOrShare } from '@/utils/nativeShare';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
  "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
  "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
  "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [includeTags, setIncludeTags] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    let result = [];
    const prefix = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";

    if (type === 'paragraphs') {
      for (let p = 0; p < count; p++) {
        let pText = '';
        if (p === 0 && startWithLorem) {
          pText += prefix;
        }

        // Generate 4-7 random sentences per paragraph
        const sentencesInP = Math.floor(Math.random() * 4) + 4;
        for (let s = 0; s < sentencesInP; s++) {
          pText += generateSentence() + ' ';
        }

        if (includeTags) {
          result.push(`<p>${pText.trim()}</p>`);
        } else {
          result.push(pText.trim());
        }
      }
      setGeneratedText(result.join(includeTags ? '\n' : '\n\n'));
    } else if (type === 'sentences') {
      for (let s = 0; s < count; s++) {
        if (s === 0 && startWithLorem) {
          result.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        } else {
          result.push(generateSentence());
        }
      }
      setGeneratedText(result.join(' '));
    } else {
      // Words
      let words: string[] = [];
      if (startWithLorem && count >= 5) {
        words = ["lorem", "ipsum", "dolor", "sit", "amet"];
      }
      while (words.length < count) {
        const randIdx = Math.floor(Math.random() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[randIdx]);
      }
      setGeneratedText(words.slice(0, count).join(' '));
    }

    toast.success('Generated placeholder text!');
  };

  const generateSentence = () => {
    // Generate 8-15 random words
    const len = Math.floor(Math.random() * 8) + 8;
    const words = [];
    for (let w = 0; w < len; w++) {
      const randIdx = Math.floor(Math.random() * LOREM_WORDS.length);
      words.push(LOREM_WORDS[randIdx]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  React.useEffect(() => {
    generateLorem();
  }, [type, count, includeTags, startWithLorem]);

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success('Copied text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadOrShare(url, 'lorem_ipsum.txt');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-500" />
          Lorem Ipsum Generator
        </h2>
        <p className="text-sm text-[var(--text-secondary)] dark:text-zinc-400 mt-1">
          Generate standard pseudo-Latin placeholder text for graphics, web designs, layout prototyping, and documents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side settings */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
          <h4 className="font-bold text-xs text-zinc-500 uppercase tracking-wider flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            Generator Options
          </h4>

          {/* Type selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[var(--text-secondary)] block">Generate By</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                    type === t
                      ? 'bg-[var(--accent)] border-indigo-600 text-white'
                      : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-[var(--text-secondary)] dark:text-zinc-400'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Count input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[var(--text-secondary)] dark:text-zinc-400">
              <span>Count</span>
              <span className="text-indigo-400 font-bold">{count}</span>
            </div>
            <input
              type="range"
              min="1"
              max={type === 'words' ? 300 : 25}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center justify-between text-[var(--text-secondary)] dark:text-zinc-400">
              <span>Start with "Lorem ipsum..."</span>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--accent)] accent-indigo-500 focus:ring-indigo-500"
              />
            </label>

            {type === 'paragraphs' && (
              <label className="flex items-center justify-between text-[var(--text-secondary)] dark:text-zinc-400">
                <span>Wrap in HTML &lt;p&gt; tags</span>
                <input
                  type="checkbox"
                  checked={includeTags}
                  onChange={(e) => setIncludeTags(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--accent)] accent-indigo-500 focus:ring-indigo-500"
                />
              </label>
            )}
          </div>

          <button
            onClick={generateLorem}
            className="w-full py-3 bg-[var(--accent)] hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Placeholder
          </button>
        </div>

        {/* Right Side previews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between min-h-[350px]">
            <div className="relative flex-1 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/5 rounded-xl p-4 overflow-y-auto max-h-[400px]">
              <span className="absolute top-2 left-2 text-[10px] text-zinc-500 font-mono">Generated Output</span>
              <div className="text-sm font-normal text-zinc-800 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap mt-4">
                {generatedText}
              </div>
            </div>

            <div className="flex gap-3 mt-6 print:hidden">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 bg-[var(--accent)] hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy Text
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-[var(--bg-surface)] dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download .TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}