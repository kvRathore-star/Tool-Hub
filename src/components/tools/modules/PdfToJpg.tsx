"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Download, FileImage, FileText, RefreshCw, Sparkles } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOutputUrl(null);
    setProgress(0);
  };

  const convertPdfToJpg = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Loading PDF...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const zip = new JSZip();

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Rendering page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for high quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Get base64 data string (remove the data URL prefix)
        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = imgDataUrl.split(',')[1];
        
        // Add image to ZIP
        zip.file(`page_${i}.jpg`, base64Data, { base64: true });
        setProgress(Math.round((i / totalPages) * 100));
      }

      setStatusText("Zipping files...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(zipBlob));
      toast.success("PDF pages converted to JPG successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to convert PDF. Try a smaller file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setOutputUrl(null);
    setProgress(0);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm flex items-center gap-2">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span><strong>100% Client-Side Conversion:</strong> Render PDF pages directly into JPEGs locally in your browser. Complete privacy.</span>
        </div>
        <FileUploader 
          accept="application/pdf"
          onFileSelect={handleFileSelect} 
          title="Upload PDF to convert to JPG"
          subtitle="Converts pages to high-resolution JPEGs"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-500" />
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-150">{file.name}</h3>
            <p className="text-zinc-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button 
          onClick={clearAll}
          disabled={isProcessing}
          className="text-xs text-zinc-650 dark:text-zinc-300 px-3 py-2 bg-zinc-150 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Action Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-bold text-base flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <FileImage className="w-5 h-5 text-indigo-500" />
              Convert Pages to Images
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will export each page of your PDF as a high-quality (200 DPI) JPEG image and bundle them into a single `.zip` file for quick downloading.
            </p>
          </div>

          <button 
            onClick={convertPdfToJpg}
            disabled={isProcessing || !!outputUrl}
            className="w-full mt-6 bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{statusText} ({progress}%)</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>Convert to JPG ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col justify-center">
          {outputUrl ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 animate-in zoom-in-95 duration-300 h-full flex flex-col justify-center">
               <div className="bg-emerald-500/10 rounded-xl overflow-hidden border border-emerald-500/20 flex flex-col items-center justify-center p-8 text-emerald-500">
                  <Download className="w-16 h-16 mb-4" />
                  <p className="font-bold text-center">pages_jpg_{file.name.replace('.pdf', '')}.zip</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Images converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `pages_jpg_${file.name.replace('.pdf', '')}.zip`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Images ZIP
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <FileImage className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Exported images ZIP will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
