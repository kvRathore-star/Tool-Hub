"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Type, Upload, Download, Settings2 } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';

export default function AddTextToPhoto() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState('Your Text Here');
  const [color, setColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImage(img);
        // Center text initially based on image size
        setXPos(img.width / 2);
        setYPos(img.height / 2);
      };
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image
      ctx.drawImage(image, 0, 0);

      // Draw text
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add subtle shadow for legibility
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(text, xPos, yPos);
    }
  }, [image, text, color, fontSize, xPos, yPos]);

  const downloadImage = () => {
    if (canvasRef.current) {
      downloadOrShare(canvasRef.current.toDataURL('image/png'), 'image-with-text.png');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Type className="w-8 h-8 text-violet-500" />
           <h2 className="text-2xl font-bold">Add Text to Photo</h2>
         </div>
         <p className="text-zinc-500 text-center">Overlay custom text onto your images using the HTML5 Canvas API entirely in your browser.</p>
         
         {!image ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative mt-8">
             <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Select Image File
             </div>
           </div>
         ) : (
           <div className="grid md:grid-cols-[300px_1fr] gap-8 mt-8">
             
             {/* Controls Sidebar */}
             <div className="space-y-6 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 h-fit">
               <div className="flex items-center gap-2 font-semibold border-b border-zinc-200 dark:border-zinc-700 pb-3">
                 <Settings2 className="w-5 h-5" />
                 Text Properties
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold">Text Content</label>
                 <input 
                   type="text" 
                   value={text} 
                   onChange={e => setText(e.target.value)} 
                   className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none"
                 />
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold">Color</label>
                 <div className="flex gap-2">
                   <input 
                     type="color" 
                     value={color} 
                     onChange={e => setColor(e.target.value)} 
                     className="h-12 w-12 rounded cursor-pointer border-0 p-0"
                   />
                   <input 
                     type="text" 
                     value={color} 
                     onChange={e => setColor(e.target.value)} 
                     className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none uppercase font-mono"
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold flex justify-between">
                   <span>Font Size</span>
                   <span className="text-zinc-500">{fontSize}px</span>
                 </label>
                 <input 
                   type="range" 
                   min="10" 
                   max="300" 
                   value={fontSize} 
                   onChange={e => setFontSize(Number(e.target.value))} 
                   className="w-full accent-violet-500"
                 />
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold flex justify-between">
                   <span>X Position</span>
                   <span className="text-zinc-500">{Math.round(xPos)}</span>
                 </label>
                 <input 
                   type="range" 
                   min="0" 
                   max={image.width} 
                   value={xPos} 
                   onChange={e => setXPos(Number(e.target.value))} 
                   className="w-full accent-violet-500"
                 />
               </div>

               <div className="space-y-3">
                 <label className="block text-sm font-semibold flex justify-between">
                   <span>Y Position</span>
                   <span className="text-zinc-500">{Math.round(yPos)}</span>
                 </label>
                 <input 
                   type="range" 
                   min="0" 
                   max={image.height} 
                   value={yPos} 
                   onChange={e => setYPos(Number(e.target.value))} 
                   className="w-full accent-violet-500"
                 />
               </div>

               <button 
                 onClick={downloadImage}
                 className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <Download className="w-5 h-5" />
                 Download Image
               </button>

               <button 
                 onClick={() => setImage(null)}
                 className="w-full text-zinc-500 hover:text-red-500 text-sm font-medium py-2 transition-colors"
               >
                 Start Over
               </button>
             </div>

             {/* Canvas Preview Area */}
             <div 
               ref={containerRef}
               className="bg-zinc-100 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-4 min-h-[400px]"
             >
               <canvas 
                 ref={canvasRef} 
                 className="max-w-full max-h-[600px] object-contain shadow-2xl"
                 style={{ 
                   backgroundImage: 'conic-gradient(#ccc 25%, white 25%, white 50%, #ccc 50%, #ccc 75%, white 75%, white)',
                   backgroundSize: '20px 20px'
                 }}
               />
             </div>
             
           </div>
         )}
      </div>
    </div>
  );
}
