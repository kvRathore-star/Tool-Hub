"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import imageCompression from 'browser-image-compression';
import { downloadOrShare } from '@/utils/nativeShare';

export default function ImageCompressor() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [quality, setQuality] = useState<number>(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setPreviewUrl(dataUrl);
    setOutputUrl(null);
    setOutputFile(null);
  };

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const processImage = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    try {
      // Calculate max size MB dynamically based on original and quality factor to simulate generic compression
      const originalMB = imageFile.size / (1024 * 1024);
      let targetMB = originalMB * quality;
      // Ensure target is somewhat meaningful
      if (targetMB > originalMB) targetMB = originalMB;

      const options = {
        maxSizeMB: targetMB,
        maxWidthOrHeight: 4096, // Keep large resolutions but compress quality
        useWebWorker: typeof window !== 'undefined' && typeof window.Worker !== 'undefined',
        initialQuality: quality,
      };
      
      const compressedFile = await imageCompression(imageFile, options);
      
      const url = URL.createObjectURL(compressedFile);
      setOutputUrl(url);
      setOutputFile(compressedFile);
    } catch (e) {
      console.error("Compression failed", e);
      alert("Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageFile || !previewUrl) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
          <strong>Smart Compression:</strong> Reduce the file size of your JPG, PNG, or WEBP images with adjustable quality settings.
        </div>
        <FileUploader 
          accept="image/jpeg,image/png,image/webp" 
          onFileSelect={handleFileSelect} 
          title="Upload Photo to Compress"
        />
      </div>
    );
  }

  const savingsPercent = outputFile ? Math.round(((imageFile.size - outputFile.size) / imageFile.size) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <h3 className="font-bold text-zinc-100 truncate max-w-xs">{imageFile.name}</h3>
          <p className="text-zinc-400 text-sm">Original Size: {(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setImageFile(null); setPreviewUrl(null); }}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Change Photo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="bg-black border border-white/10 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
          <img src={outputUrl || previewUrl} alt="Preview" className="max-h-[400px] object-contain rounded-lg" />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="p-6 border border-white/10 bg-black rounded-2xl shadow-xl">
            <h4 className="text-zinc-300 font-medium mb-6">Compression Quality</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Low Size</span>
                <span className="text-blue-400 font-bold">{Math.round(quality * 100)}%</span>
                <span className="text-zinc-400">High Quality</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            
            <button 
              onClick={processImage}
              disabled={isProcessing}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Compressing..." : "Apply Compression"}
            </button>
          </div>

          {outputUrl && outputFile && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div>
                <h4 className="text-lg font-bold text-emerald-400 mb-1">Compression Complete!</h4>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-zinc-400">New Size:</span>
                  <strong className="text-white">{(outputFile.size / 1024).toFixed(2)} KB</strong>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="text-zinc-400">Data Saved:</span>
                  <strong className="text-emerald-400">{savingsPercent}%</strong>
                </div>
              </div>
              
              <button 
                onClick={() => downloadOrShare(outputUrl, `compressed_${imageFile.name}`)}
                className="mt-2 w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-4 py-3 rounded-xl transition-colors shadow-lg"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
