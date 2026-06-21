"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Move } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';

export default function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    
    // Read total pages quickly
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPages(Array.from({ length: count }, (_, i) => i)); // 0-indexed
    } catch (err) {
      toast.error("Failed to read PDF pages");
      setFile(null);
    }
  };

  const processOrganize = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast.loading('Reordering pages...', { id: 'org' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer);
      
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(originalDoc, pages);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      downloadOrShare(url, file.name.replace('.pdf', '_reorganized.pdf'));
      toast.success('PDF Reorganized Successfully!', { id: 'org' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to organize PDF.', { id: 'org' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newPages = [...pages];
    const [movedPage] = newPages.splice(draggedIdx, 1);
    newPages.splice(targetIdx, 0, movedPage);
    
    setPages(newPages);
    setDraggedIdx(null);
  };

  const handleRemove = (idx: number) => {
    const newPages = [...pages];
    newPages.splice(idx, 1);
    setPages(newPages);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Move className="w-8 h-8 text-amber-500" />
           <h2 className="text-2xl font-bold">Organize PDF Pages</h2>
         </div>
         <p className="text-zinc-500">Drag and drop to reorder pages, or click the X to remove them entirely.</p>
         
         {!file ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative">
             <input type="file" accept="application/pdf" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             <div className="text-zinc-500 flex flex-col items-center">
                <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Click or Drag PDF Here
             </div>
           </div>
         ) : (
           <div className="space-y-6 text-left">
             <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
               <div>
                 <span className="font-semibold block">{file.name}</span>
                 <span className="text-xs text-zinc-500">Original Pages: {pages.length}</span>
               </div>
               <button onClick={() => { setFile(null); setPages([]); }} className="text-sm text-amber-600 hover:underline">Change File</button>
             </div>

             <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto p-2 bg-zinc-50/50 dark:bg-black/10 rounded-xl border border-zinc-200 dark:border-zinc-800">
               {pages.map((pageNum, idx) => (
                 <div 
                   key={`${pageNum}-${idx}`}
                   draggable
                   onDragStart={(e) => handleDragStart(e, idx)}
                   onDragOver={(e) => handleDragOver(e, idx)}
                   onDrop={(e) => handleDrop(e, idx)}
                   onDragEnd={() => setDraggedIdx(null)}
                   className={`flex flex-col items-center justify-center w-24 h-32 bg-white dark:bg-zinc-800 border-2 ${draggedIdx === idx ? 'border-dashed border-amber-400 opacity-50' : 'border-zinc-200 dark:border-zinc-700'} rounded-lg shadow-sm cursor-move hover:border-amber-400 transition-colors group relative`}
                 >
                   <button 
                     onClick={() => handleRemove(idx)}
                     className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     ×
                   </button>
                   <FileText className="w-8 h-8 text-zinc-400 mb-2" />
                   <span className="font-bold text-sm">Page {pageNum + 1}</span>
                 </div>
               ))}
               {pages.length === 0 && <div className="p-8 w-full text-center text-zinc-500">All pages removed. Cannot generate empty PDF.</div>}
             </div>
             
             <button 
               onClick={processOrganize} 
               disabled={isProcessing || pages.length === 0}
               className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Download className="w-5 h-5" />
               {isProcessing ? 'Processing...' : 'Apply Changes & Download'}
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
