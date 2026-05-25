"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Scissors } from 'lucide-react';

export default function ExtractPagesFromPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const parsePageRange = (range: string, totalPages: number): number[] => {
    const pages = new Set<number>();
    const parts = range.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          for (let i = start; i <= Math.min(end, totalPages); i++) pages.add(i - 1); // 0-indexed
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num > 0 && num <= totalPages) pages.add(num - 1);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const processExtract = async () => {
    if (!file || !pageRange.trim()) {
      toast.error('Please upload a PDF and specify pages.');
      return;
    }
    
    setIsProcessing(true);
    toast.loading('Extracting pages...', { id: 'extract' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = originalDoc.getPageCount();
      
      const indicesToKeep = parsePageRange(pageRange, totalPages);
      if (indicesToKeep.length === 0) {
        toast.error(`Invalid range. Valid pages: 1-${totalPages}`, { id: 'extract' });
        setIsProcessing(false);
        return;
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(originalDoc, indicesToKeep);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '_extracted.pdf');
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success(`Extracted ${indicesToKeep.length} pages!`, { id: 'extract' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to extract PDF. Ensure it is a valid file.', { id: 'extract' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Scissors className="w-8 h-8 text-rose-500" />
           <h2 className="text-2xl font-bold">Extract PDF Pages</h2>
         </div>
         <p className="text-zinc-500">Pull specific pages out of a large PDF to create a smaller document.</p>
         
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
               <label className="block text-sm font-semibold mb-2">Pages to Extract (e.g. 1, 3, 5-10)</label>
               <input 
                 type="text" 
                 placeholder="1, 2-5, 8" 
                 value={pageRange} 
                 onChange={(e) => setPageRange(e.target.value)}
                 className="w-full bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 outline-none focus:border-rose-500 transition-colors"
               />
             </div>
             
             <button 
               onClick={processExtract} 
               disabled={isProcessing || !pageRange.trim()}
               className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Download className="w-5 h-5" />
               {isProcessing ? 'Processing...' : 'Extract Pages & Download'}
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
