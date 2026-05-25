import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Global singleton instance so we don't re-download the 30MB wasm 
// every time the user switches between video tools.
let ffmpegGlobal: FFmpeg | null = null;

export function useFFmpeg() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    if (ffmpegGlobal && ffmpegGlobal.loaded) {
      setIsLoaded(true);
      ffmpegRef.current = ffmpegGlobal;
      setupListeners(ffmpegGlobal);
    }
    
    // Cleanup listeners on unmount
    return () => {
      if (ffmpegRef.current) {
        ffmpegRef.current.off('progress', handleProgress);
        ffmpegRef.current.off('log', handleLog);
      }
    };
  }, []);

  const handleProgress = (p: { progress: number; time: number }) => {
    // Progress goes from 0 to 1
    setProgress(Math.round(p.progress * 100));
  };

  const handleLog = ({ message }: { message: string }) => {
    setLogs(prev => [...prev.slice(-10), message]); // Keep last 10 logs
  };

  const setupListeners = (ffmpeg: FFmpeg) => {
    // Remove existing to avoid duplicates
    ffmpeg.off('progress', handleProgress);
    ffmpeg.off('log', handleLog);
    
    ffmpeg.on('progress', handleProgress);
    ffmpeg.on('log', handleLog);
  };

  const loadFFmpeg = async () => {
    if (ffmpegGlobal?.loaded) {
      setIsLoaded(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const ffmpeg = new FFmpeg();
      ffmpegGlobal = ffmpeg;
      ffmpegRef.current = ffmpeg;

      setupListeners(ffmpeg);

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      // Load the single-threaded core. 
      // Multi-threaded requires Cross-Origin-Embedder-Policy headers and SharedArrayBuffer
      // which breaks easily on regular hosting unless explicitly configured.
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        classWorkerURL: await toBlobURL('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js', 'text/javascript'),
      });

      setIsLoaded(true);
    } catch (e) {
      console.error("Failed to load FFmpeg:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ffmpeg: ffmpegRef.current,
    isLoaded,
    isLoading,
    progress,
    logs,
    loadFFmpeg,
  };
}
