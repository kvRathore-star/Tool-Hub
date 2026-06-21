"use client";

import React, { useState } from 'react';
import { Eye, Download, Code, Sparkles, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import JSZip from 'jszip';
import { downloadOrShare } from '@/utils/nativeShare';

export default function ColorPickerExtension() {
  const [activeTab, setActiveTab] = useState<'manifest' | 'popupHtml' | 'popupJs'>('manifest');
  const [extName, setExtName] = useState('My Color Picker');
  const [shortcutKey, setShortcutKey] = useState('Alt+C');

  // Extension Source Code Templates
  const manifest = `{
  "manifest_version": 3,
  "name": "${extName}",
  "version": "1.0",
  "description": "A lightweight color picker and eye dropper browser extension.",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "commands": {
    "activate-picker": {
      "suggested_key": {
        "default": "${shortcutKey}"
      },
      "description": "Activate Eye Dropper Tool"
    }
  }
}`;

  const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 220px;
      padding: 10px;
      font-family: Arial, sans-serif;
      background: #18181b;
      color: #ffffff;
      margin: 0;
    }
    .header {
      font-size: 14px;
      font-weight: bold;
      color: #6366f1;
      margin-bottom: 10px;
      text-align: center;
    }
    button {
      width: 100%;
      background: #6366f1;
      color: white;
      border: none;
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover { background: #4f46e5; }
    .color-info {
      margin-top: 10px;
      background: #09090b;
      border: 1px solid #27272a;
      padding: 8px;
      border-radius: 6px;
      display: none;
    }
    .color-block {
      height: 30px;
      border-radius: 4px;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div className="header">Eye Dropper</div>
  <button id="dropBtn">Pick Color</button>
  <div id="result" className="color-info">
    <div id="colorShow" className="color-block"></div>
    <div id="hexText" style="font-size: 12px; font-family: monospace;"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

  const popupJs = `document.getElementById('dropBtn').addEventListener('click', async () => {
  if (!window.EyeDropper) {
    toast.error("Your browser does not support EyeDropper API.");
    return;
  }
  
  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open();
    document.getElementById('result').style.display = 'block';
    document.getElementById('colorShow').style.background = result.sRGBHex;
    document.getElementById('hexText').textContent = 'HEX: ' + result.sRGBHex;
    
    // Save color to chrome storage
    chrome.storage.local.set({ lastPickedColor: result.sRGBHex });
  } catch (e) {
    console.log('Picker cancelled or failed: ', e);
  }
});`;

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      zip.file("manifest.json", manifest);
      zip.file("popup.html", popupHtml);
      zip.file("popup.js", popupJs);

      // Create a mock icon using canvas 16x16
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(0, 0, 16, 16);
      }
      const iconBlob = await new Promise<Blob | null>(res => canvas.toBlob(res));
      if (iconBlob) zip.file("icon.png", iconBlob);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      downloadOrShare(url, `color_picker_extension.zip`);
      toast.success('Chrome extension template ZIP generated!');
    } catch (err) {
      toast.error('Failed to create extension package');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Color Picker Chrome Extension Builder
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Configure and export a ready-to-load Chrome/Firefox Developer Extension that invokes the browser eye-dropper API.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor settings */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Extension Config</h3>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">Extension Name</label>
            <input 
              type="text" 
              value={extName} 
              onChange={e => setExtName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white text-xs outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">Shortcut Keys</label>
            <select value={shortcutKey} onChange={e => setShortcutKey(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white text-xs outline-none">
              <option value="Alt+C">Alt+C</option>
              <option value="Ctrl+Shift+Y">Ctrl+Shift+Y</option>
              <option value="Alt+P">Alt+P</option>
            </select>
          </div>

          <button onClick={handleDownload} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" /> Download Extension ZIP
          </button>
        </div>

        {/* Code tabs */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[450px]">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex bg-zinc-50 dark:bg-black/45 p-1 rounded-xl gap-1">
              <button 
                onClick={() => setActiveTab('manifest')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeTab === 'manifest' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
              >
                manifest.json
              </button>
              <button 
                onClick={() => setActiveTab('popupHtml')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeTab === 'popupHtml' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
              >
                popup.html
              </button>
              <button 
                onClick={() => setActiveTab('popupJs')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeTab === 'popupJs' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
              >
                popup.js
              </button>
            </div>

            <textarea
              value={activeTab === 'manifest' ? manifest : activeTab === 'popupHtml' ? popupHtml : popupJs}
              readOnly
              className="w-full flex-1 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-mono h-80 outline-none text-xs resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}