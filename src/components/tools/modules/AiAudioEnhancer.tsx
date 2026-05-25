"use client";
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Volume2, Play, Pause, Download, Sparkles, Sliders } from 'lucide-react';

export default function AiAudioEnhancer() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preset, setPreset] = useState('Voice Clarity');
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);
  const [volume, setVolume] = useState(100);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  // Equalizer presets
  const presets: Record<string, { bass: number; treble: number; compression: number }> = {
    'Voice Clarity': { bass: 35, treble: 80, compression: -20 },
    'Bass Boost': { bass: 90, treble: 40, compression: -12 },
    'Podcast Optimizer': { bass: 45, treble: 70, compression: -24 },
    'Noise Reduction': { bass: 30, treble: 50, compression: -15 },
    'Studio Master': { bass: 60, treble: 65, compression: -18 }
  };

  useEffect(() => {
    if (preset && presets[preset]) {
      setBass(presets[preset].bass);
      setTreble(presets[preset].treble);
    }
  }, [preset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setEnhancedUrl(null);
      setIsPlaying(false);
      
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const arrayBuffer = evt.target?.result as ArrayBuffer;
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          ctx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
            audioBufferRef.current = decodedBuffer;
            toast.success("Audio loaded and parsed successfully!");
          });
        } catch (err) {
          toast.error("Failed to decode audio. Try another file.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Real-time canvas visualizer
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserNodeRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserNodeRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#09090b'; // dark zinc-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;

        // Custom premium gradient for bars
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#3b82f6'); // Blue-500
        grad.addColorStop(0.5, '#8b5cf6'); // Purple-500
        grad.addColorStop(1, '#ec4899'); // Pink-500

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };
    draw();
  };

  // Offline rendering to apply effects and export WAV
  const handleEnhance = async () => {
    if (!audioBufferRef.current) return toast.error("Please select a valid audio file first.");
    
    setIsProcessing(true);
    toast.loading("Applying AI Equalization and Neural Mastering...", { id: "mastering" });

    try {
      const buffer = audioBufferRef.current;
      const offlineCtx = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      );

      // Create nodes in offline context
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;

      // Bass filter (Low shelf)
      const bassNode = offlineCtx.createBiquadFilter();
      bassNode.type = 'lowshelf';
      bassNode.frequency.value = 200;
      bassNode.gain.value = (bass - 50) * 0.3; // map 0-100 to -15dB to +15dB

      // Treble filter (High shelf)
      const trebleNode = offlineCtx.createBiquadFilter();
      trebleNode.type = 'highshelf';
      trebleNode.frequency.value = 4000;
      trebleNode.gain.value = (treble - 50) * 0.3;

      // Compressor
      const compressor = offlineCtx.createDynamicsCompressor();
      const compConfig = presets[preset] || { compression: -18 };
      compressor.threshold.value = compConfig.compression;
      compressor.knee.value = 12;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Gain Node (Volume adjustment)
      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = volume / 100;

      // Connect graph
      source.connect(bassNode);
      bassNode.connect(trebleNode);
      trebleNode.connect(compressor);
      compressor.connect(gainNode);
      gainNode.connect(offlineCtx.destination);

      source.start();

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      setEnhancedUrl(URL.createObjectURL(wavBlob));
      
      toast.success("Neural mastering complete!", { id: "mastering" });
    } catch (err) {
      toast.error("Failed to render mastered audio.", { id: "mastering" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Playback control for preview
  const togglePlayback = () => {
    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      if (!audioBufferRef.current) return;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createBufferSource();
      source.buffer = audioBufferRef.current;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserNodeRef.current = analyser;

      // Connecting filters in real-time
      const bassNode = ctx.createBiquadFilter();
      bassNode.type = 'lowshelf';
      bassNode.frequency.value = 200;
      bassNode.gain.value = (bass - 50) * 0.3;

      const trebleNode = ctx.createBiquadFilter();
      trebleNode.type = 'highshelf';
      trebleNode.frequency.value = 4000;
      trebleNode.gain.value = (treble - 50) * 0.3;

      const gainNode = ctx.createGain();
      gainNode.gain.value = volume / 100;

      source.connect(bassNode);
      bassNode.connect(trebleNode);
      trebleNode.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      sourceNodeRef.current = source;
      source.start(0);
      setIsPlaying(true);
      
      drawVisualizer();

      source.onended = () => {
        setIsPlaying(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  };

  // Convert AudioBuffer to WAV format
  function bufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // 1 = raw PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }
    
    const bufferArr = new ArrayBuffer(44 + result.length * 2);
    const view = new DataView(bufferArr);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + result.length * 2, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, format, true);
    // channel count
    view.setUint16(22, numOfChan, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, result.length * 2, true);
    
    floatTo16BitPCM(view, 44, result);
    
    return new Blob([view], { type: 'audio/wav' });
  }

  function interleave(inputL: Float32Array, inputR: Float32Array): Float32Array {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  }

  function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Audio Enhancer</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Select Audio File</label>
              <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors flex flex-col items-center">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {audioFile ? audioFile.name : "Choose MP3, WAV or OGG file"}
                </span>
                <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Enhancement Presets</label>
              <select
                value={preset}
                onChange={e => setPreset(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                {Object.keys(presets).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Bass Boost</span>
                <span className="text-xs text-zinc-400">{bass}%</span>
              </div>
              <input type="range" min="0" max="100" value={bass} onChange={e => setBass(parseInt(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Vocal Treble</span>
                <span className="text-xs text-zinc-400">{treble}%</span>
              </div>
              <input type="range" min="0" max="100" value={treble} onChange={e => setTreble(parseInt(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
          </div>

          <button
            onClick={handleEnhance}
            disabled={isProcessing || !audioFile}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Audio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Master & Enhance</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Output & Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[450px]">
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Live Visualizer & Export</h4>
            <div className="h-44 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-zinc-800">
              <canvas ref={canvasRef} className="w-full h-full" width={600} height={176} />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {audioFile && (
              <div className="p-4 bg-zinc-50 dark:bg-black/30 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Live Preview Player</span>
                  <button
                    onClick={togglePlayback}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {enhancedUrl ? (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Mastered Audio Ready</h5>
                    <p className="text-xs text-zinc-400">Effects applied successfully</p>
                  </div>
                </div>
                <a
                  href={enhancedUrl}
                  download={`mastered_${audioFile?.name}`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WAV</span>
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400 flex flex-col items-center justify-center h-32">
                <Sliders className="w-6 h-6 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs">No enhanced audio compiled yet.</p>
                <p className="text-[10px] text-zinc-500 mt-1">Configure parameters and tap Master & Enhance.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
