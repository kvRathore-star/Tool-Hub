"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import * as pdfjsLib from 'pdfjs-dist';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';
import { Files, ArrowLeft, RefreshCw, FileText, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ComparePdfFiles() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  
  const [textPagesA, setTextPagesA] = useState<string[]>([]);
  const [textPagesB, setTextPagesB] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compared, setCompared] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed
  const [diffResult, setDiffResult] = useState<any[]>([]);

  // Reset comparison on files change
  useEffect(() => {
    setCompared(false);
    setTextPagesA([]);
    setTextPagesB([]);
    setDiffResult([]);
  }, [fileA, fileB]);

  // Recalculate page diff on page change
  useEffect(() => {
    if (!compared) return;
    calculatePageDiff();
  }, [currentPage, compared]);

  const extractText = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const pagesText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str);
      // Join strings with spaces, maintaining simple line structures
      pagesText.push(textItems.join(' '));
    }
    return pagesText;
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      return toast.error("Please upload both PDF files to compare.");
    }

    setIsProcessing(true);
    try {
      const [pagesA, pagesB] = await Promise.all([
        extractText(fileA),
        extractText(fileB)
      ]);

      if (pagesA.length === 0 || pagesB.length === 0) {
        throw new Error("One or both PDF files did not contain extractable text.");
      }

      setTextPagesA(pagesA);
      setTextPagesB(pagesB);
      setCurrentPage(0);
      setCompared(true);
      toast.success("PDFs analyzed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to parse text from the PDF files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePageDiff = () => {
    const textA = textPagesA[currentPage] || '';
    const textB = textPagesB[currentPage] || '';

    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(textA, textB);
    dmp.diff_cleanupSemantic(diffs);
    setDiffResult(diffs);
  };

  const maxPages = Math.max(textPagesA.length, textPagesB.length);

  const clearAll = () => {
    setFileA(null);
    setFileB(null);
    setCompared(false);
    setTextPagesA([]);
    setTextPagesB([]);
    setDiffResult([]);
  };

  // Helper to render diff markup
  const renderDiff = () => {
    if (diffResult.length === 0) {
      return <div className="text-zinc-400 italic text-center py-8">No text on this page or identical page contents.</div>;
    }

    return (
      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed p-6 bg-white dark:bg-black/35 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-y-auto max-h-[500px]">
        {diffResult.map(([type, text], idx) => {
          if (type === DIFF_INSERT) {
            return (
              <span key={idx} className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-350 px-1 py-0.5 rounded font-medium border border-emerald-500/10">
                {text}
              </span>
            );
          } else if (type === DIFF_DELETE) {
            return (
              <span key={idx} className="bg-rose-500/20 text-rose-800 dark:text-rose-350 line-through px-1 py-0.5 rounded font-medium border border-rose-500/10">
                {text}
              </span>
            );
          } else {
            return <span key={idx} className="text-zinc-700 dark:text-zinc-300">{text}</span>;
          }
        })}
      </div>
    );
  };

  if (!compared) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm flex items-center gap-2">
          <Files className="w-5 h-5 flex-shrink-0" />
          <span><strong>100% Client-Side Comparison:</strong> Your PDF text is extracted and diffed entirely inside your web browser. Nothing goes online.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Original PDF (File A)</h4>
            {fileA ? (
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold truncate">{fileA.name}</span>
                </div>
                <button onClick={() => setFileA(null)} className="text-xs text-rose-500 font-bold ml-2">Remove</button>
              </div>
            ) : (
              <FileUploader 
                accept="application/pdf"
                onFileSelect={(f) => setFileA(f)}
                title="Select File A"
                subtitle="Primary base PDF"
              />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Modified PDF (File B)</h4>
            {fileB ? (
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold truncate">{fileB.name}</span>
                </div>
                <button onClick={() => setFileB(null)} className="text-xs text-rose-500 font-bold ml-2">Remove</button>
              </div>
            ) : (
              <FileUploader 
                accept="application/pdf"
                onFileSelect={(f) => setFileB(f)}
                title="Select File B"
                subtitle="PDF to compare against A"
              />
            )}
          </div>
        </div>

        <button 
          onClick={handleCompare}
          disabled={isProcessing || !fileA || !fileB}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing & Extracting Text...</span>
            </>
          ) : (
            <>
              <Files className="w-5 h-5" />
              <span>Compare PDF Documents</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* File Info Header */}
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Comparing Documents</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold text-zinc-900 dark:text-zinc-350">
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-indigo-500" /> A: {fileA?.name} ({textPagesA.length} pages)</span>
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-indigo-500" /> B: {fileB?.name} ({textPagesB.length} pages)</span>
          </div>
        </div>
        <button 
          onClick={clearAll}
          className="text-xs text-zinc-650 dark:text-zinc-300 px-3 py-2 bg-zinc-150 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Comparison</span>
        </button>
      </div>

      {/* Main Diff Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation / Sidebar */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-md space-y-4 h-fit">
          <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Page Selection
          </h4>

          <div className="flex items-center justify-between">
            <button 
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </button>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              Page {currentPage + 1} of {maxPages}
            </span>
            <button 
              disabled={currentPage === maxPages - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-2 max-h-[220px] overflow-y-auto pr-1">
            {Array.from({ length: maxPages }).map((_, idx) => {
              const hasPageA = idx < textPagesA.length;
              const hasPageB = idx < textPagesB.length;
              const isSelected = idx === currentPage;
              let indicatorColor = "bg-zinc-100 dark:bg-zinc-800 text-zinc-500";
              if (isSelected) {
                indicatorColor = "bg-indigo-650 text-white font-bold";
              } else if (!hasPageA || !hasPageB) {
                indicatorColor = "bg-rose-500/10 text-rose-500 border border-rose-500/25";
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`py-2 rounded-lg text-xs font-semibold text-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer ${indicatorColor}`}
                  title={`${!hasPageA ? 'File A missing page' : ''} ${!hasPageB ? 'File B missing page' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500/25 border border-emerald-500/30 rounded inline-block" /> <span>Green represents insertions (B has, A doesn't)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500/25 border border-rose-500/30 rounded inline-block" /> <span>Red represents deletions (A has, B doesn't)</span></div>
          </div>
        </div>

        {/* Diff View Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 border border-zinc-200 dark:border-white/5 rounded-xl text-xs font-bold text-zinc-450">
            <span>VISUAL DIFF</span>
            <span>PAGE {currentPage + 1}</span>
          </div>
          {renderDiff()}
        </div>

      </div>

    </div>
  );
}
