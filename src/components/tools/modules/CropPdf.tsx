"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { FileText, Crop, Download } from 'lucide-react';

export default function CropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [margin, setMargin] = useState(20); // Crop 20 points from all sides
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const processCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast.loading('Cropping PDF pages...', { id: 'crop' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        // Set new crop box (x, y, width, height)
        // Note: x, y is bottom-left corner
        page.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '_cropped.pdf');
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('PDF Cropped Successfully!', { id: 'crop' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to crop PDF. Ensure it is a valid PDF file.', { id: 'crop' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Crop className="w-8 h-8 text-indigo-500" />
           <h2 className="text-2xl font-bold">Crop PDF Pages</h2>
         </div>
         <p className="text-zinc-500">Remove white margins from your PDF documents instantly.</p>
         
         <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative">
           <input type="file" accept="application/pdf" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
           {file ? (
             <div className="flex flex-col items-center">
               <FileText className="w-16 h-16 text-red-500 mb-2" />
               <span className="font-semibold">{file.name}</span>
               <span className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
             </div>
           ) : (
             <div className="text-zinc-500 flex flex-col items-center">
                <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Click or Drag PDF Here
             </div>
           )}
         </div>

         {file && (
           <div className="space-y-4 text-left border-t border-zinc-100 dark:border-zinc-800 pt-6">
             <div>
               <label className="block text-sm font-semibold mb-2">Crop Margin (Points)</label>
               <input 
                 type="range" 
                 min="0" 
                 max="200" 
                 value={margin} 
                 onChange={(e) => setMargin(Number(e.target.value))}
                 className="w-full accent-indigo-600"
               />
               <div className="text-sm text-zinc-500 mt-1 text-center">{margin} pt removed from all edges</div>
             </div>
             
             <button 
               onClick={processCrop} 
               disabled={isProcessing}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Download className="w-5 h-5" />
               {isProcessing ? 'Processing...' : 'Crop & Download PDF'}
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
