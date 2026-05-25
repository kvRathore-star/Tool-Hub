"use client";
import React, { useState } from 'react';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Crop, Upload, Download, Loader2 } from 'lucide-react';

export default function CropVideo() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  
  const [width, setWidth] = useState('640');
  const [height, setHeight] = useState('480');
  const [xOffset, setXOffset] = useState('0');
  const [yOffset, setYOffset] = useState('0');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setOutputUrl(null);
      if (!isLoaded) await loadFFmpeg();
    }
  };

  const processVideo = async () => {
    if (!file || !ffmpeg || !isLoaded) return;
    
    setIsProcessing(true);
    try {
      const inputName = `input_${file.name.replace(/\s+/g, '_')}`;
      const outputName = 'cropped.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      
      // Crop format: crop=w:h:x:y
      const cropFilter = `crop=${width}:${height}:${xOffset}:${yOffset}`;
      
      await ffmpeg.exec(['-i', inputName, '-vf', cropFilter, '-c:a', 'copy', outputName]);
      
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (e) {
      console.error(e);
      alert('Failed to crop video. Ensure crop dimensions fit within original video bounds.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Crop className="w-8 h-8 text-indigo-500" />
           <h2 className="text-2xl font-bold">Crop Video</h2>
         </div>
         <p className="text-zinc-500">Crop the visual area of your MP4 video entirely in the browser using WebAssembly.</p>
         
         {!file ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" accept="video/mp4,video/webm" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select Video File
             </div>
           </div>
         ) : (
           <div className="mt-8 space-y-6 text-left">
             <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
               <div>
                 <div className="font-semibold">{file.name}</div>
                 <div className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
               </div>
               <button onClick={() => { setFile(null); setOutputUrl(null); }} className="text-sm text-red-500 hover:underline">Remove</button>
             </div>

             {!outputUrl && !isProcessing && (
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-semibold mb-2">Width (px)</label>
                   <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold mb-2">Height (px)</label>
                   <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold mb-2">X Offset (px)</label>
                   <input type="number" value={xOffset} onChange={e => setXOffset(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold mb-2">Y Offset (px)</label>
                   <input type="number" value={yOffset} onChange={e => setYOffset(e.target.value)} className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none" />
                 </div>
               </div>
             )}

             {(!isLoaded || isLoading) && (
               <div className="text-center text-zinc-500 py-4 flex flex-col items-center gap-2">
                 <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                 Loading FFmpeg Engine... (This may take a moment)
               </div>
             )}

             {isLoaded && !outputUrl && !isProcessing && (
               <button 
                 onClick={processVideo}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
               >
                 Crop Video
               </button>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                   <span>Processing...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                   <div className="bg-indigo-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
             )}

             {outputUrl && (
               <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                 <video controls className="w-full rounded-xl" src={outputUrl}></video>
                 <a 
                   href={outputUrl} 
                   download={`${file.name.replace(/\.[^/.]+$/, "")}_cropped.mp4`}
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" />
                   Download Cropped Video
                 </a>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
