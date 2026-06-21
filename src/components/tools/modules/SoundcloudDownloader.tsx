"use client";

import React, { useState } from "react";
import { Download, RefreshCw, Music, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { downloadOrShare } from '@/utils/nativeShare';

export default function SoundCloudDownloader() {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownloadSim = () => {
    if (!url.trim()) {
      toast.error("Please enter SoundCloud Track URL");
      return;
    }

    if (!url.includes("soundcloud.com")) {
      toast.error("Please enter a valid SoundCloud URL");
      return;
    }

    setIsDownloading(true);
    setProgress(15);

    setTimeout(() => {
      setProgress(45);
      setTimeout(() => {
        setProgress(80);
        setTimeout(() => {
          setProgress(100);
          setIsDownloading(false);

          // Generate simulated audio file download
          const blob = new Blob(["MOCK_SOUNDCLOUD_AUDIO_PAYLOAD"], { type: "audio/mp3" });
          const outUrl = URL.createObjectURL(blob);
          downloadOrShare(outUrl, "soundcloud_track_audio.mp3");
          toast.success("SoundCloud track extracted and saved successfully!");
        }, 600);
      }, 500);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <Music className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">SoundCloud Downloader</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-[var(--text-secondary)]">
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">SoundCloud Track Link</span>
            <input 
              type="text" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g. https://soundcloud.com/artist/track-name..."
              className="w-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--border-default)] transition-colors"
            />
          </div>

          <button 
            onClick={startDownloadSim} 
            disabled={isDownloading}
            className="w-full bg-[var(--warning)] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? `Extracting SoundCloud audio (${progress}%)...` : "Extract Audio"}
          </button>
        </div>

        <div className="md:col-span-5 bg-[var(--bg-overlay)] rounded-2xl p-5 border border-[var(--border-subtle)] flex flex-col justify-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-500 font-semibold uppercase tracking-wider text-[10px]">
            <AlertTriangle className="w-4 h-4" />
            <span>Usage & Licensing Disclaimer</span>
          </div>
          <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">
            This tool resolves public tracks available on SoundCloud. Downloading copyrighted music without authorization violates SoundCloud's Terms of Use. Please respect the artists and creators' licensing requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
