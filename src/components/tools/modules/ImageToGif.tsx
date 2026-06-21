"use client";
import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Images, Upload, Download, Loader2 } from 'lucide-react';

export default function ImageToGif() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  const [files, setFiles] = useState<File[]>([]);
  const [fps, setFps] = useState('2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fList = e.target.files;
    if (fList && fList.length > 0) {
      setFiles(Array.from(fList));
      setOutputUrl(null);
      if (!isLoaded) await loadFFmpeg();
    }
  };

  const processImages = async () => {
    if (files.length === 0 || !ffmpeg || !isLoaded) return;
    
    setIsProcessing(true);
    try {
      // 1. Write all files to FFmpeg memory sequentially
      for (let i = 0; i < files.length; i++) {
        await ffmpeg.writeFile(`img${i}.png`, await fetchFile(files[i]));
      }
      
      const outputName = 'output.gif';

      // 2. Combine images into a high-quality GIF using palettegen
      const vfArgs = "scale=500:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse";
      
      await ffmpeg.exec([
        '-framerate', fps,
        '-i', 'img%d.png',
        '-vf', vfArgs,
        '-loop', '0',
        outputName
      ]);
      
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      // Cleanup
      for (let i = 0; i < files.length; i++) {
        await ffmpeg.deleteFile(`img${i}.png`);
      }
      await ffmpeg.deleteFile(outputName);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate GIF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Images className="w-8 h-8 text-fuchsia-500" />
           <h2 className="text-2xl font-bold">Image to GIF Maker</h2>
         </div>
         <p className="text-zinc-500">Create animated GIFs by combining multiple images together.</p>
         
         {files.length === 0 ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select Multiple Images
             </div>
           </div>
         ) : (
           <div className="mt-8 space-y-6 text-left">
             <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
               <div>
                 <div className="font-semibold">{files.length} Images Selected</div>
                 <div className="text-sm text-zinc-500">Ready to animate</div>
               </div>
               <button onClick={() => { setFiles([]); setOutputUrl(null); }} className="text-sm text-red-500 hover:underline">Remove All</button>
             </div>
             
             {!outputUrl && !isProcessing && (
               <div>
                 <label className="block text-sm font-semibold mb-2">Speed (Frames per Second)</label>
                 <select 
                   value={fps} 
                   onChange={(e) => setFps(e.target.value)}
                   className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none"
                 >
                   <option value="1">1 FPS (Very Slow)</option>
                   <option value="2">2 FPS (Slow)</option>
                   <option value="5">5 FPS (Medium)</option>
                   <option value="10">10 FPS (Fast)</option>
                   <option value="20">20 FPS (Very Fast)</option>
                 </select>
               </div>
             )}

             {(!isLoaded || isLoading) && (
               <div className="text-center text-zinc-500 py-4 flex flex-col items-center gap-2">
                 <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
                 Loading FFmpeg Engine...
               </div>
             )}

             {isLoaded && !outputUrl && !isProcessing && (
               <button 
                 onClick={processImages}
                 className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
               >
                 Generate Animated GIF
               </button>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                   <span>Processing...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                   <div className="bg-fuchsia-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
             )}

             {outputUrl && (
               <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                 <img src={outputUrl} alt="Generated GIF" className="max-w-full rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 max-h-64 object-contain" />
                 <a 
                   href={outputUrl} 
                   download="animated.gif"
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                 >
                   <Download className="w-5 h-5" />
                   Download GIF
                 </a>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
