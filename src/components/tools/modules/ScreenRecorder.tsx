"use client";

import React, { useState, useRef, useEffect } from 'react';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [videoUrl]);

  const startRecording = async () => {
    try {
      setVideoUrl(null);
      chunksRef.current = [];
      
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      
      // Try to get mic audio as well if the user wants it
      let combinedStream = displayStream;
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const tracks = [...displayStream.getTracks(), ...micStream.getAudioTracks()];
        combinedStream = new MediaStream(tracks);
      } catch (e) {
        toast("Microphone access denied. Recording system audio only.");
      }

      streamRef.current = combinedStream;

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        streamRef.current?.getTracks().forEach(t => t.stop());
      };

      // Handle user clicking "Stop Sharing" from the browser's native UI
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      mediaRecorder.start(1000); // collect chunks every second
      setIsRecording(true);
      setIsPaused(false);
      toast.success("Recording started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start recording. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      toast.success("Recording saved!");
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-sm">
        <strong>100% Secure & Private:</strong> The screen recording happens entirely inside your browser using the MediaRecorder API. The video is never uploaded to any server.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-8 text-center min-h-[300px]">
          
          <div className="w-24 h-24 bg-white dark:bg-black border-4 border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center relative shadow-2xl">
            {isRecording ? (
              <div className="w-12 h-12 bg-red-500 rounded-lg animate-pulse" />
            ) : (
              <div className="w-12 h-12 bg-red-500 rounded-full" />
            )}
            
            {isRecording && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}
          </div>

          <div className="space-y-4 w-full">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95"
              >
                Start Recording Screen
              </button>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={togglePause}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold py-4 rounded-xl transition-colors"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button 
                  onClick={stopRecording}
                  className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-colors"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
          
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl p-6 h-full flex flex-col">
            <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Preview & Download</h4>
            
            {videoUrl ? (
              <div className="flex flex-col flex-1">
                <video src={videoUrl} controls className="w-full rounded-lg bg-white dark:bg-zinc-900 flex-1 object-contain min-h-[200px]" />
                <button 
                  onClick={() => downloadOrShare(videoUrl, `screen-recording-${new Date().getTime()}.webm`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-all active:scale-95"
                >
                  Download .WebM Video
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 p-8 text-center">
                Your recorded video will appear here when you stop recording.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
