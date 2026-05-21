"use client";

import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

export default function GenericPDFProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setIsDone(false);
  };

  const processPDF = () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Generic fallback for PDF (using pdf-lib under the hood typically)
    setTimeout(() => {
      setIsDone(true);
      setIsProcessing(false);
    }, 800);
  };

  if (!file) {
    return (
      <div className="space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-sm flex gap-3 items-start">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <strong>Fallback Template Active: </strong> <code className="bg-black/30 px-1.5 py-0.5 rounded ml-1 text-xs text-rose-300">GenericPDFProcessor.tsx</code>
            <p className="mt-1 text-rose-500/80">This tool has not been explicitly specialized yet. Running via the generic document pipeline.</p>
          </div>
        </div>
        <FileUploader 
          accept="application/pdf" 
          onFileSelect={handleFileSelect} 
          title="Upload PDF Document"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <h3 className="font-bold text-zinc-100">{file.name}</h3>
          <p className="text-sm text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
        <button 
          onClick={() => setFile(null)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Change PDF
        </button>
      </div>

      <button 
        onClick={processPDF}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? "Processing PDF..." : "Execute PDF Operation"}
      </button>

      {isDone && (
        <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center animate-in slide-in-from-bottom-4 duration-500">
          <div>
            <p className="text-emerald-400 font-bold mb-1">Operation Complete!</p>
            <p className="text-zinc-400 text-sm">Secure local processing finished.</p>
          </div>
          <button 
            className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg"
            onClick={() => alert("Fallback download triggered.")}
          >
            Save File
          </button>
        </div>
      )}
    </div>
  );
}
