"use client";

import React, { useState } from 'react';
import { Eye, Download, Code, Sparkles, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import JSZip from 'jszip';

export default function YoutubeVideoDownloaderExtension() {
  const [activeTab, setActiveTab] = useState<'manifest' | 'contentJs'>('manifest');
  const [extName, setExtName] = useState('YT Downloader Linker');

  const manifest = `{
  "manifest_version": 3,
  "name": "${extName}",
  "version": "1.0",
  "description": "Appends clean download video buttons directly under YouTube video watch streams.",
  "permissions": [
    "activeTab"
  ],
  "content_scripts": [{
    "matches": ["*://*.youtube.com/watch*"],
    "js": ["content.js"]
  }]
}`;

  const contentJs = `// Content script injected to append download triggers on watch page
function appendDownloadButton() {
  const targetBar = document.querySelector('#top-row #owner');
  if (targetBar && !document.querySelector('#yt-download-btn')) {
    const btn = document.createElement('button');
    btn.id = 'yt-download-btn';
    btn.textContent = '📥 Save Video (MP4)';
    btn.style.cssText = "background:#ff0000;color:#fff;border:none;padding:8px 16px;border-radius:18px;font-weight:bold;margin-left:12px;cursor:pointer;";
    
    btn.addEventListener('click', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const vid = urlParams.get('v');
      // Redirect to high speed local client side converter endpoint
      window.open('https://api.toolhub-downloader.mock/download/' + vid);
    });

    targetBar.appendChild(btn);
  }
}

// Watch navigation events
setInterval(appendDownloadButton, 2000);`;

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      zip.file("manifest.json", manifest);
      zip.file("content.js", contentJs);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube_downloader_extension.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('YouTube downloader extension ZIP downloaded!');
    } catch (err) {
      toast.error('Failed to create package');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-xl font-bold text-zinc-955 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          YouTube Downloader Link Injector Extension Builder
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Configure and compile a custom browser extension source package that appends download actions directly into watch pages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">Settings</span>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">Extension Name</label>
            <input 
              type="text" 
              value={extName} 
              onChange={e => setExtName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white text-xs outline-none"
            />
          </div>

          <button onClick={handleDownload} className="w-full mt-4 bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" /> Download Extension ZIP
          </button>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[450px]">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex bg-zinc-50 dark:bg-black/45 p-1 rounded-xl gap-1">
              <button onClick={() => setActiveTab('manifest')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeTab === 'manifest' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
                manifest.json
              </button>
              <button onClick={() => setActiveTab('contentJs')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeTab === 'contentJs' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
                content.js
              </button>
            </div>

            <textarea
              value={activeTab === 'manifest' ? manifest : contentJs}
              readOnly
              className="w-full flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-mono h-80 outline-none text-xs resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}