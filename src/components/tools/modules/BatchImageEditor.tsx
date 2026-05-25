"use client";
import React, { useState, useRef } from 'react';
import { Layers, Upload, Download, Settings2, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function BatchImageEditor() {
  const [files, setFiles] = useState<File[]>([]);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [watermark, setWatermark] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fList = e.target.files;
    if (fList && fList.length > 0) {
      setFiles(Array.from(fList));
    }
  };

  const processBatch = async () => {
    if (files.length === 0 || !canvasRef.current) return;
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Load image
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = URL.createObjectURL(file);
        });

        // Calculate new dimensions
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (img.width > maxWidth) {
          const ratio = maxWidth / img.width;
          targetWidth = maxWidth;
          targetHeight = img.height * ratio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw resized image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Apply watermark if provided
        if (watermark.trim() !== '') {
          ctx.font = `bold ${Math.max(20, targetWidth * 0.05)}px sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.fillText(watermark, targetWidth - 20, targetHeight - 20);
        }

        // Convert canvas to blob
        const blob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(b => resolve(b), file.type || 'image/jpeg', 0.9);
        });

        if (blob) {
          zip.file(`edited_${file.name}`, blob);
        }
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'batch_edited_images.zip');
      
    } catch (e) {
      console.error(e);
      alert('Failed to process images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Layers className="w-8 h-8 text-emerald-500" />
           <h2 className="text-2xl font-bold">Batch Image Editor</h2>
         </div>
         <p className="text-zinc-500 text-center">Resize and watermark dozens of images instantly in your browser. Downloads as a ZIP file.</p>
         
         {/* Hidden canvas for processing */}
         <canvas ref={canvasRef} style={{ display: 'none' }} />

         {files.length === 0 ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select Multiple Images
             </div>
           </div>
         ) : (
           <div className="grid md:grid-cols-2 gap-8 mt-8">
             
             {/* Summary */}
             <div className="space-y-4 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 h-fit">
               <h3 className="font-semibold text-lg border-b border-zinc-200 dark:border-zinc-700 pb-2">Queue Summary</h3>
               <div className="text-3xl font-bold text-emerald-500">{files.length}</div>
               <div className="text-zinc-500 text-sm">Images ready for processing</div>
               <button 
                 onClick={() => setFiles([])}
                 className="text-sm text-red-500 hover:underline mt-2 block"
               >
                 Clear Queue
               </button>
             </div>

             {/* Controls */}
             <div className="space-y-6 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
               <div className="flex items-center gap-2 font-semibold border-b border-zinc-200 dark:border-zinc-700 pb-3">
                 <Settings2 className="w-5 h-5" />
                 Batch Settings
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold">Max Width (px)</label>
                 <p className="text-xs text-zinc-500 mb-2">Images wider than this will be scaled down proportionally. Smaller images are ignored.</p>
                 <input 
                   type="number" 
                   value={maxWidth} 
                   onChange={e => setMaxWidth(Number(e.target.value))} 
                   className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none"
                 />
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold">Watermark Text (Optional)</label>
                 <p className="text-xs text-zinc-500 mb-2">Added to the bottom right corner of all images.</p>
                 <input 
                   type="text" 
                   value={watermark} 
                   placeholder="e.g. © 2026 MyBrand"
                   onChange={e => setWatermark(e.target.value)} 
                   className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none"
                 />
               </div>

               <button 
                 onClick={processBatch}
                 disabled={isProcessing}
                 className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     <Download className="w-5 h-5" />
                     Process & Download ZIP
                   </>
                 )}
               </button>
             </div>
             
           </div>
         )}
      </div>
    </div>
  );
}
