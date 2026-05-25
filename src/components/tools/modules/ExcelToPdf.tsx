"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Download, FileText, RefreshCw, Sparkles, Grid } from 'lucide-react';

export default function ExcelToPdf() {
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

  const convertExcelToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);
    setStatusText("Reading spreadsheet file...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      setProgress(50);
      setStatusText("Parsing sheets...");
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Convert to array of arrays (rows)
      const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawRows.length === 0) {
        throw new Error("The selected spreadsheet does not contain any data.");
      }

      setProgress(80);
      setStatusText("Building PDF grid layout...");

      const doc = new jsPDF({
        orientation: 'landscape', // Landscape is better for tables
        unit: 'mm',
        format: 'a4'
      });

      const margin = 15;
      const rowHeight = 8;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Calculate responsive column width based on columns count
      const maxCols = Math.max(...rawRows.map(r => r.length));
      const availableWidth = pageWidth - (margin * 2);
      const colWidth = maxCols > 0 ? availableWidth / Math.min(maxCols, 8) : 30; // Max 8 columns displayed before wrap/truncation

      let y = margin + 10;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Sheet: ${sheetName}`, margin, margin);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);

      rawRows.forEach((row, rowIndex) => {
        // Page break check
        if (y + rowHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        let x = margin;
        // Limit columns count to prevent text overflowing paper edge
        const colsToRender = row.slice(0, 8); 

        colsToRender.forEach((cell) => {
          const textVal = String(cell !== undefined && cell !== null ? cell : '');
          
          // Draw grid outline box
          doc.rect(x, y, colWidth, rowHeight);
          
          // Render cell text truncated if too long
          doc.text(textVal.substring(0, 22), x + 2, y + 5.5);
          x += colWidth;
        });
        y += rowHeight;
      });

      const pdfBlob = doc.output('blob');
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success("Spreadsheet converted to PDF successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to convert Excel file. Make sure it is a valid format.");
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
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm flex items-center gap-2">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span><strong>100% Offline Table Compiling:</strong> Convert sheets (XLSX, XLS, CSV) into clean PDF tables locally inside the browser.</span>
        </div>
        <FileUploader 
          accept=".xlsx,.xls,.csv" 
          onFileSelect={handleFileSelect} 
          title="Upload Spreadsheet (.xlsx, .xls, .csv)"
          subtitle="Converts grid sheets to landscale PDF layouts"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <Grid className="w-8 h-8 text-indigo-500" />
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
              <FileText className="w-5 h-5 text-indigo-500" />
              Convert Sheet to PDF Table
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will load the rows and columns of your spreadsheet sheet and render a structured landscape table inside a PDF.
            </p>
          </div>

          <button 
            onClick={convertExcelToPdf}
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
                <Grid className="w-4 h-4" />
                <span>Convert to PDF Document</span>
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
                  <p className="font-bold text-center">{file.name.replace(/\.[^/.]+$/, "")}.pdf</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace(/\.[^/.]+$/, "")}.pdf`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download PDF File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <Grid className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted PDF file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
