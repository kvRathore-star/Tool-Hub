"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function Mp4ToMp3() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(2); // VBR Quality: 0 (best) to 9 (worst). 2 is standard high quality (~190 kbps).
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOutputUrl(null);
    setOutputSize(null);
  };

  const clearAll = () => {
    setFile(null);
    setOutputUrl(null);
    setOutputSize(null);
  };

  const extractAudio = async () => {
    if (!file || !ffmpeg || !isLoaded) return;

    setIsProcessing(true);
    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // -vn: No video.
      // -c:a libmp3lame: Use MP3 encoder.
      // -q:a 2: Variable Bitrate quality 2.
      await ffmpeg.exec([
        '-i', 'input.mp4', 
        '-vn', 
        '-c:a', 'libmp3lame', 
        '-q:a', quality.toString(), 
        'output.mp3'
      ]);
      
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([data as any], { type: 'audio/mp3' });
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      toast.success("Audio extracted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during audio extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <svg className="w-12 h-12 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-zinc-500 font-medium animate-pulse">Initializing WebAssembly Core...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl text-teal-500 text-sm">
          <strong>Strip Video Safely:</strong> Extract high-quality MP3 audio from any video instantly. No files are uploaded to any server.
        </div>
        <FileUploader 
          accept="video/mp4,video/quicktime,video/webm"
          onFileSelect={handleFileSelect} 
          title="Upload Video"
          subtitle="Select a video to extract audio from"
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
          onClick={clearAll}
          disabled={isProcessing}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Settings Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 h-fit">
          <h4 className="text-zinc-900 dark:text-white font-medium border-b border-zinc-100 dark:border-zinc-800 pb-2">Audio Quality</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">VBR Quality (0-9)</label>
              <span className="text-xs font-bold text-teal-500">
                 {quality === 0 ? 'Extreme (0)' : quality === 2 ? 'High (2)' : quality === 5 ? 'Standard (5)' : `Level ${quality}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-xs text-zinc-500 px-1">
              <span>Best</span>
              <span>Smallest</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
             {isProcessing ? (
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-teal-500">
                    <span>Extracting Audio...</span>
                    <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-teal-100 dark:bg-teal-900/30 rounded-full h-3 overflow-hidden">
                   <div 
                     className="bg-teal-500 h-3 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                   ></div>
                 </div>
               </div>
             ) : (
               <button 
                 onClick={extractAudio}
                 className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                 Extract to MP3
               </button>
             )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {outputUrl ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="font-bold text-emerald-500">Extraction Complete</h4>
               </div>
               
               <div className="bg-zinc-50 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center relative">
                  <audio src={outputUrl} controls className="w-full" />
               </div>
               
               {outputSize && (
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Audio File Size:</span>
                   <span className="font-bold text-teal-500">{(outputSize / 1024 / 1024).toFixed(2)} MB</span>
                 </div>
               )}

               <button 
                  onClick={() => downloadOrShare(outputUrl, `audio_${file.name.replace(/\.[^/.]+$/, "")}.mp3`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download MP3
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-zinc-400">
               <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              <p className="text-center text-sm px-4">Your extracted MP3 will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
