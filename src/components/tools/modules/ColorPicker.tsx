"use client";

import React, { useState } from 'react';
import { Copy, Eye, Layout, Sliders, Sparkles, RefreshCw, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 }; // default
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Calculate Relative Luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Calculate Contrast Ratio
  const getContrastRatio = (colorHex1: string, colorHex2: string) => {
    const rgb1 = hexToRgb(colorHex1);
    const rgb2 = hexToRgb(colorHex2);
    
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const contrast = getContrastRatio(color, textColor);

  // WCAG status checks
  const aaNormalText = contrast >= 4.5;
  const aaLargeText = contrast >= 3.0;
  const aaaNormalText = contrast >= 7.0;
  const aaaLargeText = contrast >= 4.5;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${type} color code!`);
  };

  // Harmonious Schemes
  const generateAnalogous = () => {
    const { h, s, l } = hsl;
    return [
      `hsl(${(h + 30) % 360}, ${s}%, ${l}%)`,
      `hsl(${(h + 330) % 360}, ${s}%, ${l}%)`,
      `hsl(${(h + 60) % 360}, ${s}%, ${l}%)`
    ];
  };

  const generateTriadic = () => {
    const { h, s, l } = hsl;
    return [
      `hsl(${(h + 120) % 360}, ${s}%, ${l}%)`,
      `hsl(${(h + 240) % 360}, ${s}%, ${l}%)`
    ];
  };

  const analogous = generateAnalogous();
  const triadic = generateTriadic();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-200 dark:border-white/5 rounded-2xl">
        <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Contrast Color Picker & Palette Builder
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Select shades, copy hex/rgb codes, build triadic palettes, and validate WCAG text contrast ratios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Pickers */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Colors Selection
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase">Primary Color</label>
              <input 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="w-full h-14 rounded-xl cursor-pointer border border-zinc-200 dark:border-[var(--border-subtle)]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase">Text/Fore color</label>
              <input 
                type="color" 
                value={textColor} 
                onChange={e => setTextColor(e.target.value)} 
                className="w-full h-14 rounded-xl cursor-pointer border border-zinc-200 dark:border-[var(--border-subtle)]" 
              />
            </div>
          </div>

          {/* Color Values display */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
              <span className="text-xs font-bold text-[var(--text-secondary)] dark:text-zinc-400 font-mono">HEX: {color.toUpperCase()}</span>
              <button onClick={() => copyToClipboard(color.toUpperCase(), 'HEX')} className="text-xs text-indigo-500 font-bold flex items-center gap-1 hover:underline cursor-pointer">Copy</button>
            </div>
            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
              <span className="text-xs font-bold text-[var(--text-secondary)] dark:text-zinc-400 font-mono">RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
              <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')} className="text-xs text-indigo-500 font-bold flex items-center gap-1 hover:underline cursor-pointer">Copy</button>
            </div>
            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
              <span className="text-xs font-bold text-[var(--text-secondary)] dark:text-zinc-400 font-mono">HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
              <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')} className="text-xs text-indigo-500 font-bold flex items-center gap-1 hover:underline cursor-pointer">Copy</button>
            </div>
          </div>
        </div>

        {/* Right Col: Preview & Validation */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Contrast Ratio Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-[var(--border-subtle)] dark:border-zinc-800 mb-4">
              Contrast Preview & WCAG 2.1
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Card */}
              <div 
                className="rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg border border-zinc-200 dark:border-zinc-800 min-h-[160px]"
                style={{ backgroundColor: color, color: textColor }}
              >
                <Eye className="w-8 h-8 mb-2" />
                <h4 className="font-bold text-lg">Sample Heading</h4>
                <p className="text-xs mt-1">This is a paragraph demonstrating contrast.</p>
              </div>

              {/* WCAG Checks */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-500">Contrast Ratio:</span>
                  <span className="text-lg font-black text-indigo-500">{contrast.toFixed(2)} : 1</span>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                  <div className="flex justify-between py-2 items-center">
                    <span>AA Normal Text (4.5:1)</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${aaNormalText ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      {aaNormalText ? "PASS" : "FAIL"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span>AA Large Text (3.0:1)</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${aaLargeText ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      {aaLargeText ? "PASS" : "FAIL"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span>AAA Normal Text (7.0:1)</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${aaaNormalText ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      {aaaNormalText ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Harmony Palettes */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-[var(--border-subtle)] dark:border-zinc-800">
              Harmonious Palettes
            </h3>

            <div className="space-y-4">
              {/* Analogous */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Analogous Scheme</span>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-md" style={{ backgroundColor: color }} title={color} />
                  {analogous.map((c, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-md cursor-pointer hover:scale-105 transition-all" style={{ backgroundColor: c }} title={c} onClick={() => setColor(c)} />
                  ))}
                </div>
              </div>

              {/* Triadic */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Triadic Scheme</span>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-md" style={{ backgroundColor: color }} title={color} />
                  {triadic.map((c, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-md cursor-pointer hover:scale-105 transition-all" style={{ backgroundColor: c }} title={c} onClick={() => setColor(c)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
