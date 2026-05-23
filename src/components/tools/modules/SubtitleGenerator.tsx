"use client";

import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';
import { toast } from 'react-hot-toast';

export default function SubtitleGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const processSubtitles = () => {
    if (!file) return;
    setIsProcessing(true);
    
    toast("Generating SRT... Note: Backend API is not connected.", { icon: '⏳' });
    
    setTimeout(() => {
      setOutput(`1\
00:00:00,000 --> 00:00:03,000\
(API Stub) Missing Whisper API Key\
\
2\
00:00:03,000 --> 00:00:06,000\
Please configure the backend to get real SRT output.`);
      setIsProcessing(false);
      toast.error("API Key Missing.");
    }, 2000);
  };

  const downloadSrt = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <FileUploader 
          accept="video/*,audio/*" 
          onFileSelect={(f) => setFile(f)} 
          title="Upload Media File"
          subtitle="Supports Video and Audio"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
          <h4 className="text-white font-medium">Media Source</h4>
          <div className="bg-black p-4 rounded-lg text-sm text-zinc-400 break-all">{file.name}</div>
          
          <button 
            onClick={processSubtitles}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "Transcribing..." : "Generate .SRT"}
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-medium">SRT Output</h4>
            {output && (
              <button onClick={downloadSrt} className="text-sm text-emerald-400 hover:text-emerald-300">Download .SRT</button>
            )}
          </div>
          <textarea 
            className="flex-1 w-full bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 outline-none resize-none min-h-[200px]"
            readOnly
            value={output}
            placeholder="SRT format will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
