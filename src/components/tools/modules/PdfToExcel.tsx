"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { Download, FileText, RefreshCw, Sparkles, Grid } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToExcel() {
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

  const convertPdfToExcel = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Parsing PDF tables...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const allRows: any[][] = [];

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Analyzing page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by vertical position Y coordinate to preserve rows
        const rowsMap: { [y: number]: { x: number, str: string, width: number }[] } = {};
        
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]); // Y coordinate
          const x = Math.round(item.transform[4]); // X coordinate
          
          if (!rowsMap[y]) rowsMap[y] = [];
          rowsMap[y].push({ x, str: item.str, width: item.width || 0 });
        });

        // Sort rows from top to bottom
        const sortedY = Object.keys(rowsMap).map(Number).sort((a, b) => b - a);

        sortedY.forEach(y => {
          // Sort items in row from left to right by X coordinate
          const items = rowsMap[y].sort((a, b) => a.x - b.x);
          
          // Split cells based on horizontal gaps (e.g. gap > 40px)
          const rowCells: string[] = [];
          let currentCell = "";
          let lastX = -999;

          items.forEach(item => {
            if (lastX !== -999 && item.x - lastX > 40) {
              rowCells.push(currentCell.trim());
              currentCell = item.str;
            } else {
              currentCell += (currentCell ? " " : "") + item.str;
            }
            lastX = item.x + item.width;
          });

          if (currentCell) {
            rowCells.push(currentCell.trim());
          }

          if (rowCells.length > 0) {
            allRows.push(rowCells);
          }
        });

        setProgress(Math.round((i / totalPages) * 100));
      }

      setStatusText("Writing spreadsheet sheets...");

      // Write to SheetJS Workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      XLSX.utils.book_append_sheet(wb, ws, "PDF_Export");

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      toast.success("PDF tables exported to Excel successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to extract tables from PDF.");
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
          <span><strong>100% Client-Side Grid Processing:</strong> Parse layout rows and columns from PDF text directly into editable Excel sheets.</span>
        </div>
        <FileUploader 
          accept="application/pdf"
          onFileSelect={handleFileSelect} 
          title="Upload PDF to convert to Excel"
          subtitle="Extract structured table data into XLSX sheets"
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
              <Grid className="w-5 h-5 text-indigo-500" />
              Convert PDF to Excel
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will extract tabular data from your PDF using coordinate analysis and compile it into a standard Excel `.xlsx` sheet format.
            </p>
          </div>

          <button 
            onClick={convertPdfToExcel}
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
                <Grid className="w-4 h-4" />
                <span>Convert to Excel Sheet</span>
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
                  <p className="font-bold text-center">{file.name.replace('.pdf', '')}.xlsx</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.pdf', '')}.xlsx`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Excel Sheet
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <Grid className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Exported spreadsheet file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
