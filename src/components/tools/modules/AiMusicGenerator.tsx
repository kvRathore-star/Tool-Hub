"use client";
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Play, Pause, Download, Sparkles, Volume2, Music, Square } from 'lucide-react';

export default function AiMusicGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [genre, setGenre] = useState('Synthwave Pulse');
  const [volume, setVolume] = useState(75);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const recordDestNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  
  const schedulerTimerRef = useRef<number | null>(null);
  const currentBeatRef = useRef(0);
  const nextBeatTimeRef = useRef(0.0);

  // Musical notes frequencies (Pentatonic Scale for safe harmony)
  // C major pentatonic: C4, D4, E4, G4, A4, C5
  const scaleFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
  const bassFreqs = [65.41, 73.42, 82.41, 98.00, 110.00];

  useEffect(() => {
    return () => {
      stopSequence();
    };
  }, []);

  const startSequence = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    // Master volume node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume / 100, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // If recording is enabled, route to recording destination
    if (isRecording) {
      const dest = ctx.createMediaStreamDestination();
      recordDestNodeRef.current = dest;
      masterGain.connect(dest);
      
      const recorder = new MediaRecorder(dest.stream);
      mediaRecorderRef.current = recorder;
      recordChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(recordChunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(audioBlob));
        toast.success("Recording compiled! Download ready.");
      };
      
      recorder.start();
    }

    nextBeatTimeRef.current = ctx.currentTime;
    currentBeatRef.current = 0;

    // Scheduler loop
    const scheduleNextBeats = () => {
      while (nextBeatTimeRef.current < ctx.currentTime + 0.1) {
        playBeat(currentBeatRef.current, nextBeatTimeRef.current, ctx, masterGain);
        const beatLength = 60.0 / bpm / 2; // eighth notes
        nextBeatTimeRef.current += beatLength;
        currentBeatRef.current = (currentBeatRef.current + 1) % 16;
      }
      schedulerTimerRef.current = window.setTimeout(scheduleNextBeats, 25);
    };

    scheduleNextBeats();
    setIsPlaying(true);
  };

  const stopSequence = () => {
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleRecordToggle = () => {
    if (isPlaying) {
      stopSequence();
    }
    
    if (!isRecording) {
      setIsRecording(true);
      setRecordedUrl(null);
      toast.success("Synthesizer recording armed. Start playback to record!");
    } else {
      setIsRecording(false);
      toast.success("Recording disarmed.");
    }
  };

  // Synthesize instruments in real-time
  const playBeat = (beat: number, time: number, ctx: AudioContext, destination: AudioNode) => {
    // 1. Kick Drum (Sine wave drop pitch)
    const playKick = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(destination);

      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

      osc.start(time);
      osc.stop(time + 0.3);
    };

    // 2. Hi-Hat (White noise burst)
    const playHihat = () => {
      const bufferSize = ctx.sampleRate * 0.05; // 50ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      noise.start(time);
      noise.stop(time + 0.06);
    };

    // 3. Synth Bass arpeggio
    const playBassNode = (freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = genre === 'Synthwave Pulse' ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

      osc.start(time);
      osc.stop(time + 0.26);
    };

    // 4. Synth Lead/Arp
    const playMelodyNode = (freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add a simple delay effect simulation
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = 0.2;
      const delayGain = ctx.createGain();
      delayGain.gain.value = 0.3;

      osc.connect(gain);
      gain.connect(destination);

      // Feedback delay path
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(destination);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

      osc.start(time);
      osc.stop(time + 0.21);
    };

    // Rhythm patterns depending on genres
    if (genre === 'Synthwave Pulse') {
      // Four on the floor kick
      if (beat % 4 === 0) playKick();
      // Hi-hats on off-beats
      if (beat % 2 === 1) playHihat();
      // Steady bass arpeggio
      const bassIndex = Math.floor(beat / 4) % bassFreqs.length;
      playBassNode(bassFreqs[bassIndex]);
      
      // Melody arpeggio
      if (beat % 2 === 0) {
        const noteIndex = (beat * 3) % scaleFreqs.length;
        playMelodyNode(scaleFreqs[noteIndex]);
      }
    } else if (genre === 'Lofi Dream') {
      // Lazy chill kick
      if (beat === 0 || beat === 9) playKick();
      // Slow soft hats
      if (beat % 4 === 2) playHihat();
      // Subby triangle bass
      if (beat % 8 === 0) {
        playBassNode(bassFreqs[Math.floor(beat / 8) % bassFreqs.length] * 0.75);
      }
      // Relaxed melody
      if (beat === 2 || beat === 6 || beat === 12) {
        const noteIndex = Math.floor(Math.random() * scaleFreqs.length);
        playMelodyNode(scaleFreqs[noteIndex] * 0.5); // lower octave
      }
    } else if (genre === 'Epic Arpeggiator') {
      // Fast kick
      if (beat % 4 === 0 || beat === 6 || beat === 14) playKick();
      if (beat % 2 === 1) playHihat();
      
      // Steady fast bassline
      playBassNode(bassFreqs[Math.floor(beat / 4) % bassFreqs.length]);
      
      // Running arpeggio
      const noteIndex = (beat * 5) % scaleFreqs.length;
      playMelodyNode(scaleFreqs[noteIndex] * 2.0); // high octave
    } else {
      // Ambient Space (no drums, slow chords)
      if (beat % 8 === 0) {
        const bassIndex = Math.floor(beat / 8) % bassFreqs.length;
        playBassNode(bassFreqs[bassIndex] * 0.5);
        // Play triad chords
        const baseNote = scaleFreqs[beat % scaleFreqs.length];
        playMelodyNode(baseNote);
        playMelodyNode(baseNote * 1.25);
        playMelodyNode(baseNote * 1.5);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Music className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Music Generator</h3>
            </div>
            
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Procedurally synthesize background music loops on the fly. Record output directly to file.</p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Musical Genre / Mood</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors text-sm"
              >
                <option value="Synthwave Pulse">Synthwave Pulse (Energetic)</option>
                <option value="Lofi Dream">Lofi Dream (Chilled)</option>
                <option value="Epic Arpeggiator">Epic Arpeggiator (Fast)</option>
                <option value="Ambient Space">Ambient Space (Soft/Relaxed)</option>
              </select>
            </div>

            <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Tempo (BPM)</span>
                <span className="text-xs text-zinc-400">{bpm} BPM</span>
              </div>
              <input type="range" min="60" max="180" value={bpm} onChange={e => setBpm(parseInt(e.target.value))} className="w-full accent-blue-500" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> Output Volume</span>
                <span className="text-xs text-zinc-400">{volume}%</span>
              </div>
              <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(parseInt(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={handleRecordToggle}
              className={`py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border transition-colors ${
                isRecording 
                  ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20' 
                  : 'bg-zinc-50 hover:bg-zinc-150 border-zinc-200 dark:bg-black/20 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <div className="w-3.5 h-3.5 bg-red-650 rounded-full animate-pulse" />}
              <span>{isRecording ? "Stop Record" : "Record Loop"}</span>
            </button>

            <button
              onClick={isPlaying ? stopSequence : startSequence}
              className={`py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isPlaying 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "Pause Beat" : "Synthesize Loop"}</span>
            </button>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[450px]">
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Synthesizer Sequencer Preview</h4>
            <div className="h-44 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
              {/* Playback animation grid */}
              <div className="absolute inset-0 grid grid-cols-8 gap-1 p-4 opacity-30">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm transition-all duration-150 ${
                      isPlaying && currentBeatRef.current % 8 === i % 8 
                        ? 'bg-blue-500 scale-105' 
                        : 'bg-zinc-850'
                    }`} 
                  />
                ))}
              </div>
              <div className="relative text-center z-10">
                {isPlaying ? (
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest animate-pulse">Sequencing Realtime Audio Synthesizers...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <Music className="w-8 h-8" />
                    <p className="text-xs">Sequencer is currently idle.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {recordedUrl ? (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-white">Recorded Synthesis Loop</h5>
                    <p className="text-xs text-zinc-400">Master output captured</p>
                  </div>
                </div>
                <a
                  href={recordedUrl}
                  download={`synth_loop_${Date.now()}.webm`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Loop</span>
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-150 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400 flex flex-col items-center justify-center h-32">
                <Music className="w-6 h-6 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs">No captured loop files ready.</p>
                <p className="text-[10px] text-zinc-500 mt-1">Arm 'Record Loop' and play the synthesizer to compile.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
