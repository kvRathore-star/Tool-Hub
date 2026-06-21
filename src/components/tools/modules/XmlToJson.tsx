"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// Dynamic import to keep initial bundle size low
// Next.js handles xml2js nicely, but we wrap it in a try-catch for browser safety
import { parseStringPromise } from 'xml2js';
import { downloadOrShare } from '@/utils/nativeShare';

export default function XmlToJson() {
  const [xmlInput, setXmlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!xmlInput.trim()) {
      setJsonOutput('');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await parseStringPromise(xmlInput, { 
        explicitArray: false,
        mergeAttrs: true
      });
      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (err: any) {
      toast.error("Invalid XML format: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setXmlInput(text);
      setTimeout(() => handleConvert(), 100);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    toast.success("JSON copied to clipboard!");
  };

  const downloadJson = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadOrShare(url, 'converted.json');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload XML File
            <input type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <button 
          onClick={handleConvert}
          disabled={isProcessing}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? "Converting..." : "Convert to JSON"}
        </button>
      </div>

      {/* Editor Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        
        {/* Left: XML Input */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-white/10 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-xl">{'< >'}</span> XML Input
            </h3>
            <button 
              onClick={() => { setXmlInput(''); setJsonOutput(''); }}
              className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="<root>&#10;  <item id=&#34;1&#34;>&#10;    <name>John Doe</name>&#10;  </item>&#10;</root>"
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            spellCheck="false"
          />
        </div>

        {/* Right: JSON Output */}
        <div className="flex flex-col bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-xl">{'{ }'}</span> JSON Output
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                disabled={!jsonOutput}
                className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Copy
              </button>
              <button 
                onClick={downloadJson}
                disabled={!jsonOutput}
                className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Save .json
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            {jsonOutput ? (
              <pre className="text-emerald-600 dark:text-emerald-400 m-0">
                {jsonOutput}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2 opacity-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span>JSON output will appear here</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
