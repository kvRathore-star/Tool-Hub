"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Download, FileText, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

export default function EpubToPdf() {
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

  const convertEpubToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(15);
    setStatusText("Reading EPUB structure...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      setProgress(35);
      setStatusText("Parsing metadata and manifest...");

      // 1. Locate container.xml to find content.opf path
      const containerFile = zip.file("META-INF/container.xml");
      if (!containerFile) {
        throw new Error("Invalid EPUB format. container.xml missing.");
      }
      
      const containerXml = await containerFile.async("text");
      const parser = new DOMParser();
      const containerDoc = parser.parseFromString(containerXml, "text/xml");
      const rootfileTag = containerDoc.getElementsByTagName("rootfile")[0];
      const opfPath = rootfileTag?.getAttribute("full-path") || "OEBPS/content.opf";
      
      // 2. Load content.opf
      const opfFile = zip.file(opfPath);
      if (!opfFile) {
        throw new Error("Could not locate package manifest (content.opf).");
      }
      
      const opfXml = await opfFile.async("text");
      const opfDoc = parser.parseFromString(opfXml, "text/xml");
      
      // Extract manifest items
      const manifestItems = opfDoc.getElementsByTagName("item");
      const manifestMap: { [id: string]: string } = {};
      for (let i = 0; i < manifestItems.length; i++) {
        const id = manifestItems[i].getAttribute("id");
        const href = manifestItems[i].getAttribute("href");
        if (id && href) {
          // Resolve relative path relative to OPF file path directory
          const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
          manifestMap[id] = opfDir + href;
        }
      }

      // Extract spine order (reading sequence)
      const spineItems = opfDoc.getElementsByTagName("itemref");
      const spinePaths: string[] = [];
      for (let i = 0; i < spineItems.length; i++) {
        const idref = spineItems[i].getAttribute("idref");
        if (idref && manifestMap[idref]) {
          spinePaths.push(manifestMap[idref]);
        }
      }

      if (spinePaths.length === 0) {
        throw new Error("No readable chapters found inside EPUB.");
      }

      // 3. Load text content from spine chapters
      const extractedText: string[] = [];
      for (let i = 0; i < spinePaths.length; i++) {
        setStatusText(`Extracting chapter ${i + 1} of ${spinePaths.length}...`);
        const chapterFile = zip.file(spinePaths[i]);
        if (!chapterFile) continue;

        const htmlText = await chapterFile.async("text");
        const chapterDoc = parser.parseFromString(htmlText, "text/html");
        
        // Extract paragraph/heading texts
        const paragraphs = chapterDoc.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
        paragraphs.forEach(p => {
          const t = p.textContent?.trim();
          if (t) extractedText.push(t);
        });

        setProgress(35 + Math.round((i / spinePaths.length) * 45));
      }

      setProgress(85);
      setStatusText("Compiling ebook PDF...");

      const doc = new jsPDF();
      let y = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - (margin * 2);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);

      extractedText.forEach(text => {
        const splitText = doc.splitTextToSize(text, maxWidth);
        const linesCount = splitText.length;
        const blockHeight = linesCount * 6;

        if (y + blockHeight > pageHeight - margin) {
          doc.addPage();
          y = 20;
        }

        doc.text(splitText, margin, y);
        y += blockHeight + 6;
      });

      const pdfBlob = doc.output('blob');

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success("Ebook converted to PDF successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to convert EPUB document.");
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
          <span><strong>100% Offline Converter:</strong> Parse EPUB book chapters and flow text automatically into formatted PDF sheets locally.</span>
        </div>
        <FileUploader 
          accept=".epub" 
          onFileSelect={handleFileSelect} 
          title="Upload Ebook (.epub)"
          subtitle="Reads metadata, manifest spine, and text elements"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-500" />
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
              Convert EPUB to PDF
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will extract text nodes from each chapter page in their correct reading order and arrange them into standard A4 PDF document sheets.
            </p>
          </div>

          <button 
            onClick={convertEpubToPdf}
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
                <BookOpen className="w-4 h-4" />
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
                  <p className="font-bold text-center">{file.name.replace('.epub', '')}.pdf</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Ebook converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.epub', '')}.pdf`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download PDF File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <BookOpen className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted PDF file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
