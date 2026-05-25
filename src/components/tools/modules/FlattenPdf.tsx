"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Layers } from 'lucide-react';

export default function FlattenPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const processFlatten = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast.loading('Flattening PDF...', { id: 'flatten' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const form = pdfDoc.getForm();
      form.flatten();

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '_flattened.pdf');
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('PDF Flattened Successfully!', { id: 'flatten' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to flatten PDF. Ensure it is a valid PDF file.', { id: 'flatten' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <Layers className="w-8 h-8 text-blue-500" />
           <h2 className="text-2xl font-bold">Flatten PDF Forms</h2>
         </div>
         <p className="text-zinc-500">Make interactive PDF forms, annotations, and layers permanent and uneditable.</p>
         
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
           <button 
             onClick={processFlatten} 
             disabled={isProcessing}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             <Download className="w-5 h-5" />
             {isProcessing ? 'Processing...' : 'Flatten & Download PDF'}
           </button>
         )}
      </div>
    </div>
  );
}
