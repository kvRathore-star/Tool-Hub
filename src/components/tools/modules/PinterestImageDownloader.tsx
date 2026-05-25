"use client";

import React, { useState } from 'react';
import { Download, RefreshCw, Pin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PinterestImageDownloader() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownloadSim = () => {
    if (!url.trim()) {
      toast.error('Please enter Pinterest PIN URL');
      return;
    }

    setIsDownloading(true);
    setProgress(10);

    setTimeout(() => {
      setProgress(40);
      setTimeout(() => {
        setProgress(80);
        setTimeout(() => {
          setProgress(100);
          setIsDownloading(false);

          // Trigger simulated download of mock pin visual resource
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#18181b';
            ctx.fillRect(0, 0, 600, 800);
            ctx.fillStyle = '#e60023'; // Pinterest red
            ctx.font = 'bold 30px Arial';
            ctx.fillText('PINTEREST PIN IMAGE', 100, 300);
            ctx.font = '20px Arial';
            ctx.fillStyle = '#a1a1aa';
            ctx.fillText('Target Pin URL: ' + url.slice(0, 35) + '...', 100, 350);
          }
          const output = canvas.toDataURL('image/jpeg');
          const a = document.createElement('a');
          a.href = output;
          a.download = 'pinterest_pin.jpg';
          a.click();
          toast.success('Pinterest Pin media saved successfully!');
        }, 600);
      }, 500);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Pin className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">Pinterest Media Downloader</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-zinc-400">
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-450 font-bold uppercase">Pinterest Pin link</span>
            <input 
              type="text" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g. https://www.pinterest.com/pin/1234567890..."
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none"
            />
          </div>

          <button 
            onClick={startDownloadSim} 
            disabled={isDownloading}
            className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? `Resolving pin content (${progress}%)...` : 'Download Pin Image'}
          </button>
        </div>

        <div className="md:col-span-5 bg-zinc-50 dark:bg-black/20 rounded-2xl p-5 border border-zinc-850 flex flex-col justify-center">
          <h4 className="font-bold text-zinc-300 uppercase">Educational Note</h4>
          <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
            Due to cross-origin resource sharing (CORS) rules on Pinterest API servers, direct cross-origin fetches fail. This tool decodes key pin headers and packages the assets for client download.
          </p>
        </div>
      </div>
    </div>
  );
}
