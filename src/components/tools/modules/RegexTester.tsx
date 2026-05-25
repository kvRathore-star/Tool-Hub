"use client";
import React, { useState, useEffect } from 'react';
import { Search, Info, Settings2, RefreshCw } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Enter text here to test your regular expression.\\n\\nSample: user@example.com is a valid email address.\\nPhone: 123-456-7890.');
  const [matches, setMatches] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      setError(null);
      
      const newMatches = [];
      let match;
      
      if (flags.includes('g')) {
        let iterations = 0;
        while ((match = regex.exec(testString)) !== null && iterations < 1000) {
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
          newMatches.push({ match: match[0], index: match.index });
          iterations++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          newMatches.push({ match: match[0], index: match.index });
        }
      }
      
      setMatches(newMatches);
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  // Function to highlight matches in text
  const renderHighlightedText = () => {
    if (!pattern || error || matches.length === 0) return testString;
    
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    
    // Sort matches by index to ensure proper sequential rendering
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    sortedMatches.forEach((m, i) => {
      // Add text before match
      if (m.index > lastIndex) {
        elements.push(testString.substring(lastIndex, m.index));
      }
      
      // Add highlighted match
      elements.push(
        <span key={i} className="bg-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-sm font-semibold">
          {m.match}
        </span>
      );
      
      lastIndex = m.index + m.match.length;
    });
    
    // Add remaining text
    if (lastIndex < testString.length) {
      elements.push(testString.substring(lastIndex));
    }
    
    return elements;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Regex Tester</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Test and debug regular expressions in real-time</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Expression Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-zinc-500" />
              Regular Expression
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-4 text-zinc-400 text-lg">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                />
                <span className="absolute right-4 text-zinc-400 text-lg">/</span>
              </div>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="gmi"
                className="w-24 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Test String Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Test String</label>
                <button
                  onClick={() => setTestString('')}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full h-64 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono resize-none"
                placeholder="Enter text to test your regular expression against..."
                spellCheck={false}
              />
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Match Results</label>
                <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400 font-mono">
                  {matches.length} match{matches.length !== 1 && 'es'}
                </span>
              </div>
              <div className="w-full h-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm font-mono overflow-auto whitespace-pre-wrap break-words">
                {renderHighlightedText()}
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl p-4 flex gap-3 text-sm text-purple-800 dark:text-purple-300">
            <Info className="w-5 h-5 shrink-0" />
            <p>
              Common flags: <strong>g</strong> (global match), <strong>i</strong> (ignore case), <strong>m</strong> (multiline), <strong>s</strong> (dotall).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}