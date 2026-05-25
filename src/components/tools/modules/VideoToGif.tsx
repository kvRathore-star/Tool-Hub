"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function VideoToGif() {
  const { ffmpeg, isLoaded, isLoading, progress, loadFFmpeg } = useFFmpeg();
  
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(320);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOutputUrl(null);
    setOutputSize(null);
  };

  const clearAll = () => {
    setFile(null);
    setOutputUrl(null);
    setOutputSize(null);
  };

  const convertToGif = async () => {
    if (!file || !ffmpeg || !isLoaded) return;

    setIsProcessing(true);
    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      // High-quality GIF generation using palettegen
      const filterGraph = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
      
      await ffmpeg.exec([
        '-i', 'input.mp4', 
        '-vf', filterGraph,
        '-loop', '0', // Infinite loop
        'output.gif'
      ]);
      
      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data as any], { type: 'image/gif' });
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      toast.success("GIF generated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during GIF generation.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <svg className="w-12 h-12 text-pink-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-zinc-500 font-medium animate-pulse">Initializing WebAssembly Core...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl text-pink-500 text-sm">
          <strong>Make Memes Offline:</strong> Convert any video clip into a high-quality looping GIF instantly. Powered by browser-native FFmpeg WASM.
        </div>
        <FileUploader 
          accept="video/mp4,video/quicktime,video/webm"
          onFileSelect={handleFileSelect} 
          title="Upload Video"
          subtitle="Select a video to convert to GIF"
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
          onClick={clearAll}
          disabled={isProcessing}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Settings Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 h-fit">
          <h4 className="text-zinc-900 dark:text-white font-medium border-b border-zinc-100 dark:border-zinc-800 pb-2">GIF Settings</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Frames per Second</label>
              <span className="text-xs font-bold text-pink-500">{fps} FPS</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((val) => (
                <button
                  key={val}
                  onClick={() => setFps(val)}
                  disabled={isProcessing}
                  className={`py-2 text-xs font-bold border rounded-lg transition-colors ${fps === val ? 'bg-pink-600 text-white border-pink-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'}`}
                >
                  {val} FPS
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Width (Resolution)</label>
              <span className="text-xs font-bold text-pink-500">{width}px</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[320, 480, 640].map((val) => (
                <button
                  key={val}
                  onClick={() => setWidth(val)}
                  disabled={isProcessing}
                  className={`py-2 text-xs font-bold border rounded-lg transition-colors ${width === val ? 'bg-pink-600 text-white border-pink-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'}`}
                >
                  {val}px
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
             {isProcessing ? (
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-pink-500">
                    <span>Generating GIF...</span>
                    <span>{progress}%</span>
                 </div>
                 <div className="w-full bg-pink-100 dark:bg-pink-900/30 rounded-full h-3 overflow-hidden">
                   <div 
                     className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                     style={{ width: `${progress}%` }}
                   ></div>
                 </div>
               </div>
             ) : (
               <button 
                 onClick={convertToGif}
                 className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Convert to GIF
               </button>
             )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {outputUrl ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="font-bold text-pink-500">GIF Created</h4>
               </div>
               
               <div className="bg-zinc-100 dark:bg-black rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center relative p-4 chess-bg">
                  <style dangerouslySetInnerHTML={{__html: `
                    .chess-bg {
                      background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
                      background-size: 20px 20px; background-position: 0 0, 10px 10px;
                    }
                    @media (prefers-color-scheme: dark) { .chess-bg { background-image: linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111); } }
                  `}} />
                  <img src={outputUrl} alt="Generated GIF" className="max-w-full max-h-[250px] object-contain rounded z-10 drop-shadow-md" />
               </div>
               
               {outputSize && (
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">File Size:</span>
                   <span className="font-bold text-pink-500">{(outputSize / 1024 / 1024).toFixed(2)} MB</span>
                 </div>
               )}

               <button 
                  onClick={() => downloadOrShare(outputUrl, `animated_${file.name.replace(/\.[^/.]+$/, "")}.gif`)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download GIF
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-zinc-400">
               <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-center text-sm px-4">Your animated GIF will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
