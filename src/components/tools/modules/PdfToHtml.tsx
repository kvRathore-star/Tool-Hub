"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, FileText, RefreshCw, Sparkles, Code } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToHtml() {
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

  const convertPdfToHtml = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Reading PDF pages...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;

      let bodyContent = "";

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Extracting text from page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const linesMap: { [y: number]: string[] } = {};
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!linesMap[y]) linesMap[y] = [];
          linesMap[y].push(item.str);
        });

        const sortedY = Object.keys(linesMap).map(Number).sort((a, b) => b - a);

        bodyContent += `<section class="page" id="page-${i}">\n`;
        bodyContent += `<h2 class="page-number">Page ${i}</h2>\n`;

        sortedY.forEach(y => {
          const lineStr = linesMap[y].join(' ').trim();
          if (lineStr) {
            const escaped = lineStr
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");
            bodyContent += `  <p>${escaped}</p>\n`;
          }
        });

        bodyContent += `</section>\n`;
        setProgress(Math.round((i / totalPages) * 100));
      }

      const title = file.name.replace(/\.pdf$/i, '');
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .page { background: #fff; padding: 40px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); page-break-after: always; }
    .page-number { font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 16px; font-family: -apple-system, sans-serif; text-transform: uppercase; letter-spacing: 1px; }
    p { margin-bottom: 0.8em; text-indent: 1.5em; }
    @media print { body { background: #fff; padding: 0; } .page { box-shadow: none; margin: 0; border-radius: 0; padding: 20px 40px; } .page-number { display: none; } }
    @media (prefers-color-scheme: dark) { body { background: #111; color: #e5e7eb; } .page { background: #1a1a2e; box-shadow: 0 1px 3px rgba(0,0,0,0.3); } .page-number { color: #9ca3af; } }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="text-align:center;margin:40px 0;font-size:28px;color:#4f46e5;">${title}</h1>
    ${bodyContent}
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      toast.success("PDF converted to HTML successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to convert PDF to HTML.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
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
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-indigo-400 text-sm flex items-center gap-2">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span><strong>100% Client-Side:</strong> Extract text from PDF pages and generate a clean, responsive HTML document entirely in your browser.</span>
        </div>
        <FileUploader
          accept="application/pdf"
          onFileSelect={handleFileSelect}
          title="Upload PDF to convert to HTML"
          subtitle="Extracts text content as semantic HTML5"
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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-bold text-base flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Code className="w-5 h-5 text-indigo-500" />
              Convert to HTML Document
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Every page will be extracted into semantic HTML5 sections with responsive styling, print-ready CSS, and automatic dark mode support.
            </p>
          </div>

          <button
            onClick={convertPdfToHtml}
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
                <Code className="w-4 h-4" />
                <span>Convert to HTML</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col justify-center">
          {outputUrl ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 animate-in zoom-in-95 duration-300 h-full flex flex-col justify-center">
              <div className="bg-emerald-500/10 rounded-xl overflow-hidden border border-emerald-500/20 flex flex-col items-center justify-center p-8 text-emerald-500">
                <Download className="w-16 h-16 mb-4" />
                <p className="font-bold text-center">{file.name.replace('.pdf', '')}.html</p>
                <p className="text-xs text-emerald-500/80 mt-1">HTML document generated successfully.</p>
              </div>

              <button
                onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.pdf', '')}.html`)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Download HTML File
              </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
              <Code className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">Converted HTML file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
