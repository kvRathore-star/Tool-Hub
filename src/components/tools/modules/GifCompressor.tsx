"use client";
import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { FileDown, Upload, Download, Loader2 } from 'lucide-react';

export default function GifCompressor() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setOutputUrl(null);
      if (!isLoaded) await loadFFmpeg();
    }
  };

  const processGif = async () => {
    if (!file || !ffmpeg || !isLoaded) return;
    
    setIsProcessing(true);
    try {
      const inputName = `input_${file.name.replace(/\s+/g, '_')}`;
      const outputName = 'compressed.gif';

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      
      let filterArgs: string[] = [];
      if (level === 'light') {
        filterArgs = ['-vf', "scale='min(800,iw)':-1", '-r', '20'];
      } else if (level === 'medium') {
        filterArgs = ['-vf', "scale='min(500,iw)':-1", '-r', '15'];
      } else {
        filterArgs = ['-vf', "scale='min(320,iw)':-1", '-r', '10'];
      }
      
      // FFmpeg optimizes GIFs using split and palettegen for high quality, but for compression we want smaller size
      await ffmpeg.exec(['-i', inputName, ...filterArgs, outputName]);
      
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (e) {
      console.error(e);
      toast.error("Failed to compress GIF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <FileDown className="w-8 h-8 text-pink-500" />
           <h2 className="text-2xl font-bold">GIF Compressor</h2>
         </div>
         <p className="text-zinc-500">Reduce GIF file sizes instantly without losing too much visual quality.</p>
         
         {!file ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" accept="image/gif" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select GIF File
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
               <div>
                 <label className="block text-sm font-semibold mb-2">Compression Level</label>
                 <select 
                   value={level} 
                   onChange={(e) => setLevel(e.target.value)}
                   className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none"
                 >
                   <option value="light">Light Compression (Max 800px width, 20fps)</option>
                   <option value="medium">Medium Compression (Max 500px width, 15fps)</option>
                   <option value="heavy">Heavy Compression (Max 320px width, 10fps)</option>
                 </select>
               </div>
             )}

             {(!isLoaded || isLoading) && (
               <div className="text-center text-zinc-500 py-4 flex flex-col items-center gap-2">
                 <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                 Loading FFmpeg Engine...
               </div>
             )}

             {isLoaded && !outputUrl && !isProcessing && (
               <button 
                 onClick={processGif}
                 className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
               >
                 Compress GIF
               </button>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm font-semibold text-pink-600 dark:text-pink-400">
                   <span>Processing...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                   <div className="bg-pink-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
             )}

             {outputUrl && (
               <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                 <img src={outputUrl} alt="Compressed" className="max-w-full rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 max-h-64 object-contain" />
                 <a 
                   href={outputUrl} 
                   download={`${file.name.replace(/\.[^/.]+$/, "")}_compressed.gif`}
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                 >
                   <Download className="w-5 h-5" />
                   Download Compressed GIF
                 </a>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
