"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchCobaltDownload, CobaltResponse } from '@/utils/cobaltApi';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CobaltResponse | null>(null);
  
  const [vQuality, setVQuality] = useState<'360'|'720'|'1080'>('1080');
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube link');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    const res = await fetchCobaltDownload({
      url,
      vQuality,
      isAudioOnly,
    });

    if (res.status === 'error' || res.status === 'rate-limit') {
      toast.error(res.text || 'Failed to generate download link');
    } else {
      toast.success('Download link ready!');
      setResult(res);
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center space-y-2">
         <div className="inline-flex items-center justify-center p-4 bg-red-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
               <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
         </div>
         <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">YouTube Downloader</h2>
         <p className="text-zinc-500 dark:text-zinc-400">Download YouTube videos in HD or extract high-quality MP3 audio.</p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-red-500/5 dark:bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mb-2">YouTube Video Link</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="w-full bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-red-500 rounded-xl px-4 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-2">Format</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
              <button 
                onClick={() => setIsAudioOnly(false)}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${!isAudioOnly ? 'bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Video (MP4)
              </button>
              <button 
                onClick={() => setIsAudioOnly(true)}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${isAudioOnly ? 'bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Audio (MP3)
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-2">Quality</label>
            <select
              value={vQuality}
              onChange={(e) => setVQuality(e.target.value as any)}
              disabled={isAudioOnly}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-200 px-3 py-2.5 rounded-lg text-sm font-medium outline-none disabled:opacity-50"
            >
              <option value="1080">1080p (FHD)</option>
              <option value="720">720p (HD)</option>
              <option value="360">360p (SD)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Video...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Generate Download Link
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && result.url && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center space-y-4">
           <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
           </div>
           
           <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">Ready to Download</h3>
           
           <a 
             href={result.url} 
             target="_blank" 
             rel="noreferrer"
             className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             {isAudioOnly ? 'Download Audio' : 'Download Video'}
           </a>
        </div>
      )}

    </div>
  );
}
