"use client";

import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';
import { toast } from 'react-hot-toast';

export default function AudioToText() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState('');

  const processAudio = () => {
    if (!file) return;
    setIsProcessing(true);
    
    toast("Uploading to Whisper API. Note: Backend API is not connected.", { icon: '⏳' });
    
    setTimeout(() => {
      setOutput("(API Stub) This is the transcribed text of your voice note. Please configure OpenAI Whisper API to get real results.");
      setIsProcessing(false);
      toast.error("API Key Missing.");
    }, 2000);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
          <strong>Whisper API:</strong> Convert voice memos and audio files to highly accurate text notes.
        </div>
        <FileUploader 
          accept="audio/*" 
          onFileSelect={(f) => setFile(f)} 
          title="Upload Voice Note"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <h3 className="font-bold text-zinc-100">{file.name}</h3>
          <p className="text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setFile(null); setOutput(''); }}
          className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
          <h4 className="text-white font-medium">Original Audio</h4>
          <audio src={URL.createObjectURL(file)} controls className="w-full" />
          
          <button 
            onClick={processAudio}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "Transcribing..." : "Transcribe to Text"}
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col">
          <h4 className="text-white font-medium mb-4">Transcription</h4>
          <textarea 
            className="flex-1 w-full bg-black border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 outline-none resize-none min-h-[200px]"
            readOnly
            value={output}
            placeholder="Your transcribed text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
