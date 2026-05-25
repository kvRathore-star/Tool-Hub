"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';

export default function FlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  // Generate the flipped image when buttons are clicked
  useEffect(() => {
    if (!dataUrl) return;
    
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Move to center, scale, then move back
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          setOutputUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, file?.type || 'image/png');
    };
    img.src = dataUrl;
  }, [flipH, flipV, dataUrl]);

  const handleFileSelect = (selectedFile: File, url: string) => {
    setFile(selectedFile);
    setDataUrl(url);
    setFlipH(false);
    setFlipV(false);
  };

  const clearAll = () => {
    setFile(null);
    setDataUrl('');
    setOutputUrl(null);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
          <strong>Mirror & Flip:</strong> Instantly flip any image horizontally or vertically. Processing happens entirely on your device for absolute privacy.
        </div>
        <FileUploader 
          accept="image/*"
          onFileSelect={handleFileSelect} 
          title="Upload Image"
          subtitle="Drag & drop your photo to flip it"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{file.name}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
        <button 
          onClick={clearAll}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
        >
          Change Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 h-fit md:col-span-1">
          <h4 className="text-zinc-900 dark:text-white font-medium">Flip Controls</h4>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setFlipH(!flipH)}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all border-2 ${flipH ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-400'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Flip Horizontally
            </button>
            
            <button
              onClick={() => setFlipV(!flipV)}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all border-2 ${flipV ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-400'}`}
            >
              <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Flip Vertically
            </button>
          </div>

          <button 
            onClick={() => { setFlipH(false); setFlipV(false); }}
            className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm font-semibold py-2"
          >
            Reset
          </button>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          <button 
            onClick={() => outputUrl && downloadOrShare(outputUrl, `flipped_${file.name}`)}
            disabled={!outputUrl || (!flipH && !flipV)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Image
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col md:col-span-2">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4">
            <h4 className="text-zinc-900 dark:text-white font-medium">Live Preview</h4>
            {isProcessing && <span className="text-xs text-blue-500 animate-pulse">Updating...</span>}
          </div>

          <div className="flex-1 bg-zinc-50 dark:bg-black rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-4 min-h-[300px] chess-bg">
            <style dangerouslySetInnerHTML={{__html: `
              .chess-bg {
                background-image: 
                  linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
                  linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
                background-size: 20px 20px;
                background-position: 0 0, 10px 10px;
              }
              @media (prefers-color-scheme: dark) {
                .chess-bg {
                  background-image: 
                    linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111),
                    linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111);
                }
              }
            `}} />
            
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Displayed Image */}
            <img 
              src={outputUrl || dataUrl} 
              alt="Preview" 
              className="max-h-[400px] object-contain drop-shadow-md rounded transition-transform duration-300"
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
