"use client";

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { downloadOrShare } from '@/utils/nativeShare';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://toolhub.pages.dev');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) {
      setDataUrl(null);
      return;
    }

    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(text, {
          width: 512,
          margin: 2,
          color: {
            dark: color,
            light: bgColor
          },
          errorCorrectionLevel: errorCorrection
        });
        setDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(generateQR, 300);
    return () => clearTimeout(debounce);
  }, [text, color, bgColor, errorCorrection]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
        <strong>Client-Side Generation:</strong> Create QR codes instantly without sending your data to any server. Completely private and secure.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="p-6 border border-zinc-200 dark:border-white/10 bg-white dark:bg-black rounded-2xl shadow-xl space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                URL or Text to encode
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL, email, or text..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  QR Color
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-zinc-500 font-mono text-sm">{color}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Background
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-zinc-500 font-mono text-sm">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setErrorCorrection(level)}
                    className={`py-2 rounded-lg font-medium transition-colors ${errorCorrection === level ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {errorCorrection === 'L' && 'Low (7%) - Best for long URLs'}
                {errorCorrection === 'M' && 'Medium (15%) - Standard'}
                {errorCorrection === 'Q' && 'Quartile (25%) - Good for logos'}
                {errorCorrection === 'H' && 'High (30%) - Maximum resilience'}
              </p>
            </div>

          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          {dataUrl ? (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="p-4 bg-white rounded-2xl shadow-2xl mb-8">
                <img src={dataUrl} alt="Generated QR Code" className="w-64 h-64 object-contain" />
              </div>
              
              <button 
                onClick={() => downloadOrShare(dataUrl, `qrcode_${Date.now()}.png`)}
                className="w-full max-w-xs bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PNG
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-zinc-600">No Data</span>
              </div>
              <p className="text-zinc-500">Enter text to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
