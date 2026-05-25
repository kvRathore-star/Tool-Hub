"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Download, FileText, RefreshCw, Sparkles, FileEdit } from 'lucide-react';

export default function WordToPdf() {
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

  const convertWordToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);
    setStatusText("Reading Word file structure...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      setProgress(50);
      setStatusText("Extracting document XML...");
      
      const docXmlFile = zip.file("word/document.xml");
      if (!docXmlFile) {
        throw new Error("Invalid .docx file. Could not find document XML structure.");
      }
      
      const docXmlText = await docXmlFile.async("text");
      
      setProgress(75);
      setStatusText("Parsing XML structure...");

      // DOM Parser to parse w:p elements
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(docXmlText, "text/xml");
      const paragraphs = xmlDoc.getElementsByTagName("w:p");
      
      const extractedParagraphs: string[] = [];
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        let pText = "";
        
        // Find text runs
        const textRuns = p.getElementsByTagName("w:t");
        for (let j = 0; j < textRuns.length; j++) {
          pText += textRuns[j].textContent || "";
        }
        
        extractedParagraphs.push(pText.trim());
      }

      setProgress(90);
      setStatusText("Generating PDF document...");

      const doc = new jsPDF();
      let y = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - (margin * 2);
      
      // Default formatting styling
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      
      extractedParagraphs.forEach(text => {
        if (!text) {
          y += 5; // Empty paragraph spacing
          return;
        }

        const splitText = doc.splitTextToSize(text, maxWidth);
        const linesCount = splitText.length;
        const blockHeight = linesCount * 6; // Standard spacing
        
        if (y + blockHeight > pageHeight - margin) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(splitText, margin, y);
        y += blockHeight + 6; // Paragraph spacing
      });

      const pdfBlob = doc.output('blob');
      
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success("Word file converted to PDF successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to convert Word file. Make sure it is a valid .docx format.");
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
          <span><strong>100% Client-Side Conversion:</strong> Parse Word XML and render PDF outputs entirely locally inside your browser. No server overhead.</span>
        </div>
        <FileUploader 
          accept=".docx" 
          onFileSelect={handleFileSelect} 
          title="Upload Word Document (.docx)"
          subtitle="Supports standard .docx formatting and paragraphs"
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
              <FileEdit className="w-5 h-5 text-indigo-500" />
              Convert Word to PDF
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will unzip the Word document, parse the text structures and paragraphs, and generate a printable PDF layout.
            </p>
          </div>

          <button 
            onClick={convertWordToPdf}
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
                <FileEdit className="w-4 h-4" />
                <span>Convert to PDF</span>
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
                  <p className="font-bold text-center">{file.name.replace('.docx', '')}.pdf</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.docx', '')}.pdf`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download PDF File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <FileEdit className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted PDF file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
