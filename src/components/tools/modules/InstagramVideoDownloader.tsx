"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchCobaltDownload, CobaltResponse } from '@/utils/cobaltApi';

export default function InstagramVideoDownloader() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CobaltResponse | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error('Please enter an Instagram URL');
      return;
    }
    
    if (!url.includes('instagram.com')) {
      toast.error('Please enter a valid Instagram link');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    const res = await fetchCobaltDownload({ url });

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
         <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
               <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zm4.25 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
            </svg>
         </div>
         <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Instagram Downloader</h2>
         <p className="text-zinc-500 dark:text-zinc-400">Download Instagram Reels, Videos, and Photos easily.</p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-pink-500/5 dark:bg-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mb-2">Instagram Reel/Video Link</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/123456789"
            className="w-full bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-pink-500 rounded-xl px-4 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors"
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Extracting Media...
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
             Download Media
           </a>
        </div>
      )}

    </div>
  );
}
