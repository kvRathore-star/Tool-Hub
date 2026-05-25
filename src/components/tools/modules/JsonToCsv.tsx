"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');

  const handleConvert = () => {
    if (!jsonInput.trim()) {
      setCsvOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      
      // Papaparse unparse expects an array of objects
      const dataToConvert = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
      
      const csv = Papa.unparse(dataToConvert);
      setCsvOutput(csv);
    } catch (err) {
      toast.error("Invalid JSON format. Please ensure your JSON is well-formed.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonInput(text);
      setTimeout(() => handleConvert(), 100);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    toast.success("CSV copied to clipboard!");
  };

  const downloadCsv = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload JSON File
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <button 
          onClick={handleConvert}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow transition-all active:scale-95"
        >
          Convert to CSV
        </button>
      </div>

      {/* Editor Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        
        {/* Left: JSON Input */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-white/10 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-xl">{'{ }'}</span> JSON Input
            </h3>
            <button 
              onClick={() => { setJsonInput(''); setCsvOutput(''); }}
              className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="[&#10;  {&#10;    &#34;id&#34;: 1,&#10;    &#34;name&#34;: &#34;John Doe&#34;&#10;  }&#10;]"
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            spellCheck="false"
          />
        </div>

        {/* Right: CSV Output */}
        <div className="flex flex-col bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm flex items-center gap-2">
               <span className="text-xl">📄</span> CSV Output
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                disabled={!csvOutput}
                className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Copy
              </button>
              <button 
                onClick={downloadCsv}
                disabled={!csvOutput}
                className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Save .csv
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            {csvOutput ? (
              <pre className="text-emerald-600 dark:text-emerald-400 m-0">
                {csvOutput}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2 opacity-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span>CSV output will appear here</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
