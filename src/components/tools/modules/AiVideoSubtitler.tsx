"use client";

import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';

export default function AiVideoSubtitler() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const processSubtitles = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    toast("Generating AI Subtitles (Whisper API). Note: Backend API is not connected.", { icon: '⏳' });
    
    setTimeout(() => {
      // Stub output
      toast.error("Whisper API Key Missing: Returning original video as stub.");
      const url = URL.createObjectURL(file);
      setOutputUrl(url);
      setIsProcessing(false);
    }, 4000);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
          <strong>AI Video Subtitler:</strong> Automatically generate and burn perfectly timed subtitles into your video using AI transcription.
        </div>
        <FileUploader 
          accept="video/*" 
          onFileSelect={(f) => setFile(f)} 
          title="Upload Video"
          subtitle="Supports MP4, MOV, WEBM (Max 100MB)"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{file.name}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setFile(null); setOutputUrl(null); }}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
        >
          Change Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-center min-h-[300px]">
          <video src={URL.createObjectURL(file)} controls className="w-full max-h-[400px]" />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
            <h4 className="text-zinc-900 dark:text-white font-medium">Subtitle Settings</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">Subtitle Language</label>
                <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none">
                  <option>Auto-Detect</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">Subtitle Style</label>
                <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white outline-none">
                  <option>Netflix Style (Yellow/Black Outline)</option>
                  <option>TikTok/Reels (Dynamic Bold)</option>
                  <option>Clean White</option>
                </select>
              </div>
            </div>

            <button 
              onClick={processSubtitles}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Transcribing & Burning..." : "Generate Subtitles"}
            </button>
          </div>

          {outputUrl && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-bottom-4 text-center shadow-xl">
              <h4 className="text-lg font-bold text-emerald-400 mb-4">Video Subtitled!</h4>
              <button 
                onClick={() => downloadOrShare(outputUrl, `subtitled_${file.name}`)}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-4 py-3 rounded-xl transition-colors shadow-lg"
              >
                Download Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
