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
      const originalMB = imageFile.size / (1024 * 1024);
      let targetMB = originalMB * quality;
      if (targetMB > originalMB) targetMB = originalMB;

      const options = {
        maxSizeMB: targetMB,
        maxWidthOrHeight: 4096,
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
        <div className="bg-[var(--bg-overlay)] border border-[var(--border-subtle)] p-4 rounded-xl text-[var(--text-secondary)] text-sm font-medium">
          <strong>Smart Compression:</strong> Reduce the file size of your JPG, PNG, or WEBP images with adjustable quality settings. 100% private.
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
      <div className="flex justify-between items-center bg-[var(--bg-overlay)] p-4 rounded-xl border border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bold text-[var(--text-primary)] truncate max-w-xs">{imageFile.name}</h3>
          <p className="text-[var(--text-secondary)] text-sm">Original Size: {(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setImageFile(null); setPreviewUrl(null); }}
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)]"
        >
          Change Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
          <img src={outputUrl || previewUrl} alt="Preview" className="max-h-[400px] object-contain rounded-lg shadow-[var(--shadow-md)]" />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] rounded-2xl shadow-[var(--shadow-md)]">
            <h4 className="text-[var(--text-primary)] font-medium mb-6">Compression Quality</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Low Size</span>
                <span className="text-[var(--accent)] font-bold">{Math.round(quality * 100)}%</span>
                <span className="text-[var(--text-secondary)]">High Quality</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-surface)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />
            </div>
            
            <button 
              onClick={processImage}
              disabled={isProcessing}
              className="mt-8 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Compressing..." : "Apply Compression →"}
            </button>
          </div>

          {outputUrl && outputFile && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div>
                <h4 className="text-lg font-bold text-emerald-400 mb-1">Compression Complete!</h4>
                <div className="flex justify-between items-center mt-2 text-sm border-b border-emerald-500/20 pb-2">
                  <span className="text-[var(--text-secondary)]">New Size:</span>
                  <strong className="text-[var(--text-primary)] font-mono">{(outputFile.size / 1024).toFixed(2)} KB</strong>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-[var(--text-secondary)]">Data Saved:</span>
                  <strong className="text-emerald-400 font-mono">{savingsPercent}%</strong>
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
