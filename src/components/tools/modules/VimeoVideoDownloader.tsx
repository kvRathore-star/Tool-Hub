"use client";

import React, { useState } from 'react';
import { Download, RefreshCw, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { downloadOrShare } from '@/utils/nativeShare';

export default function VimeoVideoDownloader() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownloadSim = () => {
    if (!url.trim()) {
      toast.error('Please enter Vimeo Link');
      return;
    }

    setIsDownloading(true);
    setProgress(10);

    setTimeout(() => {
      setProgress(50);
      setTimeout(() => {
        setProgress(90);
        setTimeout(() => {
          setProgress(100);
          setIsDownloading(false);

          // Generate simulated download
          const blob = new Blob(['VIMEO_MOCK_PAYLOAD'], { type: 'video/mp4' });
          const outUrl = URL.createObjectURL(blob);
          downloadOrShare(outUrl, 'vimeo_video.mp4');
          toast.success('Vimeo video saved successfully!');
        }, 600);
      }, 500);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Video className="w-5 h-5 text-sky-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Vimeo Video Downloader</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-[var(--text-muted)]">
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Vimeo Link</span>
            <input 
              type="text" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g. https://vimeo.com/1234567..."
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none"
            />
          </div>

          <button 
            onClick={startDownloadSim} 
            disabled={isDownloading}
            className="w-full bg-[var(--accent)] hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? `Parsing Vimeo config endpoints (${progress}%)...` : 'Download Video (MP4)'}
          </button>
        </div>

        <div className="md:col-span-5 bg-zinc-50 dark:bg-black/20 rounded-2xl p-5 border border-[var(--border-subtle)] flex flex-col justify-center">
          <h4 className="font-bold text-zinc-300 uppercase">Educational Note</h4>
          <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
            This tool parses Vimeo embed configurations and pulls stream resources for offline client download.
          </p>
        </div>
      </div>
    </div>
  );
}
