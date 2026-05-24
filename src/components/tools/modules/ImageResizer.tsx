"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';

export default function ImageResizer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setPreviewUrl(dataUrl);
    setOutputUrl(null);
    setOutputFile(null);
    
    // Load image to get original dimensions
    const img = new Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setOriginalRatio(img.width / img.height);
    };
    img.src = dataUrl;
  };

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleWidthChange = (val: string) => {
    const w = parseInt(val, 10);
    setWidth(w || 0);
    if (maintainAspect && w > 0) {
      setHeight(Math.round(w / originalRatio));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val, 10);
    setHeight(h || 0);
    if (maintainAspect && h > 0) {
      setWidth(Math.round(h * originalRatio));
    }
  };

  const processImage = async () => {
    if (!imageFile || !previewUrl || !width || !height) return;
    
    setIsProcessing(true);
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas missing");

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context missing");

      // Draw image at new size
      ctx.drawImage(img, 0, 0, width, height);

      // Export
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, imageFile.type, 0.9);
      });

      if (!blob) throw new Error("Blob creation failed");

      const resizedFile = new File([blob], `resized_${imageFile.name}`, { type: imageFile.type });
      const url = URL.createObjectURL(blob);
      
      setOutputUrl(url);
      setOutputFile(resizedFile);
    } catch (e) {
      console.error("Resize failed", e);
      alert("Failed to resize image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageFile || !previewUrl) {
    return (
      <div className="space-y-6">
        <div className="bg-[var(--bg-overlay)] border border-[var(--border-subtle)] p-4 rounded-xl text-[var(--text-secondary)] text-sm font-medium">
          <strong>Client-Side Resizing:</strong> Instantly resize any JPG, PNG, or WEBP image using browser Canvas API. 100% private.
        </div>
        <FileUploader 
          accept="image/jpeg,image/png,image/webp" 
          onFileSelect={handleFileSelect} 
          title="Upload Photo to Resize"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-between items-center bg-[var(--bg-overlay)] p-4 rounded-xl border border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bold text-[var(--text-primary)] truncate max-w-xs">{imageFile.name}</h3>
          <p className="text-[var(--text-secondary)] text-sm">Original Size: {(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        <button 
          onClick={() => { setImageFile(null); setPreviewUrl(null); setOutputUrl(null); }}
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

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] rounded-2xl shadow-[var(--shadow-md)]">
            <h4 className="text-[var(--text-primary)] font-medium mb-6">Dimensions</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Width (px)</label>
                <input 
                  type="number" 
                  value={width || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg px-4 py-2.5 focus:border-[var(--accent)] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Height (px)</label>
                <input 
                  type="number" 
                  value={height || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg px-4 py-2.5 focus:border-[var(--accent)] outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setMaintainAspect(!maintainAspect)}>
                <input type="checkbox" checked={maintainAspect} readOnly className="accent-[var(--accent)] w-4 h-4" />
                <span className="text-sm text-[var(--text-secondary)]">Maintain Aspect Ratio</span>
              </div>
            </div>
            
            <button 
              onClick={processImage}
              disabled={isProcessing}
              className="mt-8 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "Resizing..." : "Resize Image →"}
            </button>
          </div>

          {outputUrl && outputFile && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div>
                <h4 className="text-lg font-bold text-emerald-400 mb-1">Resizing Complete!</h4>
                <div className="flex justify-between items-center mt-2 text-sm border-b border-emerald-500/20 pb-2">
                  <span className="text-[var(--text-secondary)]">New Dimensions:</span>
                  <strong className="text-[var(--text-primary)] font-mono">{width} × {height}</strong>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-[var(--text-secondary)]">New File Size:</span>
                  <strong className="text-emerald-400 font-mono">{(outputFile.size / 1024).toFixed(2)} KB</strong>
                </div>
              </div>
              
              <button 
                onClick={() => downloadOrShare(outputUrl, `resized_${width}x${height}_${imageFile.name}`)}
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
