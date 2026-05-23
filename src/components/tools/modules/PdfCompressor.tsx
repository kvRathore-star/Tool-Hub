"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { PDFDocument } from 'pdf-lib';
import { downloadOrShare } from '@/utils/nativeShare';

export default function PdfCompressor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setOutputUrl(null);
  };

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const processCompress = async () => {
    if (!pdfFile) return;
    
    setIsProcessing(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      // Load the PDF. pdf-lib will parse the objects.
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Basic client-side optimization techniques:
      // 1. Remove metadata
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      // 2. Save with object streams to compress the internal structure
      const compressedPdfBytes = await pdf.save({ useObjectStreams: true });
      
      const blob = new Blob([compressedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch (e) {
      console.error("PDF Compression failed", e);
      alert("Failed to compress PDF. The file might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pdfFile) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
          <strong>Basic PDF Optimization:</strong> Removes unnecessary metadata and optimizes object streams. Heavy image compression requires server-side tools.
        </div>
        <FileUploader 
          accept="application/pdf" 
          onFileSelect={handleFileSelect} 
          title="Upload PDF to Compress"
        />
      </div>
    );
  }

  const savingsPercent = outputSize ? Math.round(((pdfFile.size - outputSize) / pdfFile.size) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs">{pdfFile.name}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Original Size: {(pdfFile.size / 1024).toFixed(2)} KB</p>
        </div>
        <button 
          onClick={() => setPdfFile(null)}
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white"
        >
          Change PDF
        </button>
      </div>

      <div className="p-6 border border-zinc-200 dark:border-white/10 bg-white dark:bg-black rounded-2xl shadow-xl">
        <h4 className="text-zinc-700 dark:text-zinc-300 font-medium mb-4">Compression Strategy</h4>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-4 rounded-xl mb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Client-side compression optimizes the internal PDF structure and strips hidden metadata. It is highly effective for text-heavy documents but may not significantly reduce files containing large scanned images.
          </p>
        </div>

        <button 
          onClick={processCompress}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? "Optimizing PDF..." : "Optimize PDF"}
        </button>
      </div>

      {outputUrl && outputSize && (
        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 animate-in slide-in-from-bottom-4">
          <div className="w-full">
            <h4 className="text-lg font-bold text-emerald-400 mb-2">Optimization Complete!</h4>
            <div className="flex justify-between items-center text-sm border-b border-emerald-500/20 pb-2 mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">New Size:</span>
              <strong className="text-zinc-900 dark:text-white">{(outputSize / 1024).toFixed(2)} KB</strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Data Saved:</span>
              <strong className={savingsPercent > 0 ? "text-emerald-400" : "text-amber-400"}>
                {savingsPercent}%
              </strong>
            </div>
          </div>
          
          <button 
            onClick={() => downloadOrShare(outputUrl, `optimized_${pdfFile.name}`)}
            className="w-full md:w-auto bg-white text-zinc-900 hover:bg-zinc-200 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg whitespace-nowrap"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
