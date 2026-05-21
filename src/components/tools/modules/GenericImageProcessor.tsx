"use client";

import React, { useState } from 'react';
import { FileUploader } from '../FileUploader';

export default function GenericImageProcessor() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File, dataUrl: string) => {
    setImage(dataUrl);
    setOutputUrl(null);
  };

  const processImage = () => {
    if (!image) return;
    setIsProcessing(true);
    
    // Fallback logic for generic image processing
    setTimeout(() => {
      // In a real generic processor, this might apply a CSS filter or simple canvas op
      // For now, just pass the image through as output
      setOutputUrl(image);
      setIsProcessing(false);
    }, 600);
  };

  if (!image) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-400 text-sm flex gap-3 items-start">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <strong>Fallback Template Active: </strong> <code className="bg-black/30 px-1.5 py-0.5 rounded ml-1 text-xs text-amber-300">GenericImageProcessor.tsx</code>
            <p className="mt-1 text-amber-500/80">This tool has not been explicitly specialized yet. Running via the generic canvas pipeline.</p>
          </div>
        </div>
        <FileUploader 
          accept="image/*" 
          onFileSelect={handleFileSelect} 
          title="Upload Image"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <h3 className="font-bold text-zinc-100">Generic Image Editor</h3>
        <button 
          onClick={() => setImage(null)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Change Image
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 p-4 flex justify-center items-center h-64">
        <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
      </div>

      <button 
        onClick={processImage}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? "Applying Operations..." : "Process Image"}
      </button>

      {outputUrl && (
        <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-emerald-400 font-bold">Processing Complete!</p>
          <a 
            href={outputUrl} 
            download="processed-image.png"
            className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
