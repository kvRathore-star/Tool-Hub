"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import heic2any from 'heic2any';
import { FileText, Download, UploadCloud } from 'lucide-react';
import { downloadOrShare } from '@/utils/nativeShare';

export default function HeicToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const processConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast.loading('Converting HEIC to PDF...', { id: 'heic' });

    try {
      // 1. Convert HEIC to JPEG blob using heic2any
      const blobResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      const finalBlob = Array.isArray(blobResult) ? blobResult[0] : blobResult;
      
      // 2. Read JPEG ArrayBuffer
      const jpgBuffer = await finalBlob.arrayBuffer();

      // 3. Create PDF and embed JPEG
      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc.embedJpg(jpgBuffer);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      // 4. Save and download
      const pdfBytes = await pdfDoc.save();
      const outBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(outBlob);
      
      downloadOrShare(url, file.name.replace(/\.(heic|heif)$/i, '.pdf'));
      toast.success('HEIC Converted to PDF!', { id: 'heic' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to convert. Ensure it is a valid HEIC/HEIF file.', { id: 'heic' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-2xl shadow-xl space-y-6 text-center">
         <div className="flex items-center justify-center gap-3 mb-2">
           <UploadCloud className="w-8 h-8 text-emerald-500" />
           <h2 className="text-2xl font-bold">HEIC to PDF Converter</h2>
         </div>
         <p className="text-zinc-500">Convert Apple iOS High-Efficiency Image Format (HEIC/HEIF) photos directly into a standard PDF document offline.</p>
         
         <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative">
           <input type="file" accept=".heic,.heif" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
           {file ? (
             <div className="flex flex-col items-center">
               <FileText className="w-16 h-16 text-emerald-500 mb-2" />
               <span className="font-semibold">{file.name}</span>
               <span className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
             </div>
           ) : (
             <div className="text-zinc-500 flex flex-col items-center">
                <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-2" />
                Click or Drag HEIC Image Here
             </div>
           )}
         </div>

         {file && (
           <button 
             onClick={processConvert} 
             disabled={isProcessing}
             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             <Download className="w-5 h-5" />
             {isProcessing ? 'Converting...' : 'Convert to PDF & Download'}
           </button>
         )}
      </div>
    </div>
  );
}
