"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, FileText, RefreshCw, Sparkles, FileEdit } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToWord() {
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

  const convertPdfToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Reading PDF pages...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      
      let htmlContent = "";

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Extracting text from page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by their vertical position (y coordinate) to preserve simple lines
        const linesMap: { [y: number]: string[] } = {};
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]); // Y coordinate
          if (!linesMap[y]) linesMap[y] = [];
          linesMap[y].push(item.str);
        });

        // Sort lines from top to bottom
        const sortedY = Object.keys(linesMap).map(Number).sort((a, b) => b - a);
        let pageText = "";
        
        sortedY.forEach(y => {
          // Join elements in the same line with space
          const lineStr = linesMap[y].join(' ').trim();
          if (lineStr) {
            pageText += `<p style="margin: 0 0 10px 0; font-family: Calibri, Arial, sans-serif; font-size: 11pt;">${lineStr}</p>\n`;
          }
        });

        // Add page break if not the last page
        if (i < totalPages) {
          htmlContent += `<div class="page">${pageText}</div>\n<br clear="all" style="page-break-before:always" />\n`;
        } else {
          htmlContent += `<div class="page">${pageText}</div>\n`;
        }

        setProgress(Math.round((i / totalPages) * 100));
      }

      setStatusText("Generating Word Document...");
      
      // Standard HTML structure that MS Word opens as a document
      const docHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <title>Converted Document</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page {
              size: 8.5in 11.0in;
              margin: 1.0in 1.0in 1.0in 1.0in;
              mso-header-margin: .5in;
              mso-footer-margin: .5in;
              mso-paper-source: 0;
            }
            body {
              font-family: Calibri, Arial, sans-serif;
            }
            div.page {
              page: page;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      toast.success("PDF converted to Word successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to parse PDF file.");
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
          <span><strong>100% Client-Side Parsing:</strong> Extract paragraphs, layouts, and lines directly into editable Word documents offline.</span>
        </div>
        <FileUploader 
          accept="application/pdf"
          onFileSelect={handleFileSelect} 
          title="Upload PDF to convert to Word"
          subtitle="Supports text extraction into editable DOC formats"
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
            <h3 className="font-bold text-zinc-900 dark:text-[var(--text-primary)]">{file.name}</h3>
            <p className="text-zinc-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button 
          onClick={clearAll}
          disabled={isProcessing}
          className="text-xs text-[var(--text-secondary)] dark:text-zinc-300 px-3 py-2 bg-[var(--bg-overlay)] dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Action Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-bold text-base flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <FileEdit className="w-5 h-5 text-indigo-500" />
              Convert PDF to DOC
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will reconstruct the document's paragraph structure and text alignment, providing a fully editable Word Document (Microsoft Word compatible `.doc` format).
            </p>
          </div>

          <button 
            onClick={convertPdfToWord}
            disabled={isProcessing || !!outputUrl}
            className="w-full mt-6 bg-[var(--accent)] hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{statusText} ({progress}%)</span>
              </>
            ) : (
              <>
                <FileEdit className="w-4 h-4" />
                <span>Convert to Word Document</span>
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
                  <p className="font-bold text-center">{file.name.replace('.pdf', '')}.doc</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.pdf', '')}.doc`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Word File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <FileEdit className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted document file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
