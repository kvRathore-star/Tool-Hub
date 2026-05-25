"use client";
import React, { useState } from 'react';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Waves, Upload, Download, Loader2 } from 'lucide-react';

export default function WavCompressor() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
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

  const processAudio = async () => {
    if (!file || !ffmpeg || !isLoaded) return;
    
    setIsProcessing(true);
    try {
      const inputName = `input_${file.name.replace(/\s+/g, '_')}`;
      const outputName = 'compressed.wav';

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      
      // Compress WAV by reducing sample rate to 22050Hz and mapping to mono
      await ffmpeg.exec(['-i', inputName, '-ar', '22050', '-ac', '1', outputName]);
      
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (e) {
      console.error(e);
      alert('Failed to compress WAV.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Waves className="w-8 h-8 text-cyan-500" />
           <h2 className="text-2xl font-bold">WAV Compressor</h2>
         </div>
         <p className="text-zinc-500">Compress heavy WAV files by downmixing to mono and reducing the sample rate.</p>
         
         {!file ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" accept=".wav" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select WAV File
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

             {(!isLoaded || isLoading) && (
               <div className="text-center text-zinc-500 py-4 flex flex-col items-center gap-2">
                 <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                 Loading FFmpeg Engine... (This may take a moment)
               </div>
             )}

             {isLoaded && !outputUrl && !isProcessing && (
               <button 
                 onClick={processAudio}
                 className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
               >
                 Compress WAV
               </button>
             )}

             {isProcessing && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                   <span>Processing...</span>
                   <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                   <div className="bg-cyan-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
             )}

             {outputUrl && (
               <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                 <audio controls className="w-full" src={outputUrl}></audio>
                 <a 
                   href={outputUrl} 
                   download={`${file.name.replace(/\.[^/.]+$/, "")}_compressed.wav`}
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" />
                   Download Compressed WAV
                 </a>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
