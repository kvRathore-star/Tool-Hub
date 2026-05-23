"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';

export default function AiImageUpscaler() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(4); // 2x, 4x, 8x

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const processUpscale = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate AI API call
    toast("Initiating AI Upscaling (Real-ESRGAN). Note: Backend API is not connected in this environment.", { icon: '⏳' });
    
    try {
      // Stub: in a real app, we would send this to a Cloudflare Worker or Replicate API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Stub output: returning the same image for demonstration
      toast.error("AI API Key Missing: Returning original image as stub.");
      const url = URL.createObjectURL(file);
      setOutputUrl(url);
    } catch (e) {
      toast.error("Upscaling failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-purple-400 text-sm">
          <strong>AI Powered (Real-ESRGAN):</strong> Enhance and upscale low-resolution images without losing quality using state-of-the-art AI.
        </div>
        <FileUploader 
          accept="image/*" 
          onFileSelect={(f) => setFile(f)} 
          title="Upload Image to Upscale"
          subtitle="Supports JPG, PNG, WEBP"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{file.name}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setFile(null); setOutputUrl(null); }}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
        >
          Change Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[300px]">
          <img src={URL.createObjectURL(file)} className="max-h-[300px] object-contain rounded-lg" alt="Original" />
          <p className="text-zinc-500 text-sm mt-4">Original Image Preview</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
            <h4 className="text-zinc-900 dark:text-white font-medium">Upscale Settings</h4>
            
            <div className="grid grid-cols-3 gap-3">
              {[2, 4, 8].map(s => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`py-3 rounded-xl font-bold text-sm transition-colors border ${scale === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white dark:bg-black border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-800'}`}
                >
                  {s}x Scale
                </button>
              ))}
            </div>

            <div className="bg-zinc-50/50 dark:bg-black/50 p-4 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
              <span className="text-purple-400 font-bold block mb-1">Real-ESRGAN Model</span>
              Optimized for anime, illustrations, and general photography.
            </div>

            <button 
              onClick={processUpscale}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Enhancing via AI..." : `Upscale Image ${scale}x`}
            </button>
          </div>

          {outputUrl && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-bottom-4 text-center shadow-xl">
              <h4 className="text-lg font-bold text-emerald-400 mb-4">Upscale Complete!</h4>
              <button 
                onClick={() => downloadOrShare(outputUrl, `upscaled_${scale}x_${file.name}`)}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-4 py-3 rounded-xl transition-colors shadow-lg"
              >
                Download HD Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
