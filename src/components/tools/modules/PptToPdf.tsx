"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Download, FileText, RefreshCw, Sparkles, Presentation } from 'lucide-react';

export default function PptToPdf() {
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

  const convertPptToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(20);
    setStatusText("Reading PowerPoint archive...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      setProgress(40);
      setStatusText("Scanning slide files...");

      // Find slide files in zip (e.g. ppt/slides/slide1.xml)
      const slideFiles: { name: string, file: JSZip.JSZipObject }[] = [];
      zip.forEach((relativePath, fileObj) => {
        if (relativePath.startsWith("ppt/slides/slide") && relativePath.endsWith(".xml")) {
          slideFiles.push({ name: relativePath, file: fileObj });
        }
      });

      if (slideFiles.length === 0) {
        throw new Error("Invalid PowerPoint file or no slides found.");
      }

      // Sort slides by number index (e.g., slide1.xml, slide2.xml ... slide10.xml)
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.join('') || '0');
        const numB = parseInt(b.name.match(/\d+/)?.join('') || '0');
        return numA - numB;
      });

      const slidesText: string[][] = [];
      const parser = new DOMParser();

      for (let i = 0; i < slideFiles.length; i++) {
        setStatusText(`Extracting slide ${i + 1} of ${slideFiles.length}...`);
        const xmlText = await slideFiles[i].file.async("text");
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Extract all drawing text nodes (<a:t> elements)
        const textElements = xmlDoc.getElementsByTagName("a:t");
        const slideTexts: string[] = [];
        for (let j = 0; j < textElements.length; j++) {
          const t = textElements[j].textContent;
          if (t && t.trim()) slideTexts.push(t.trim());
        }
        slidesText.push(slideTexts);
        setProgress(40 + Math.round((i / slideFiles.length) * 40));
      }

      setStatusText("Compiling slide layouts into PDF...");
      setProgress(90);

      const doc = new jsPDF({
        orientation: 'landscape', // Match widescreen slides
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      slidesText.forEach((slideLines, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Draw slide boundary border
        doc.setDrawColor(220, 220, 220);
        doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

        // Header Title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229); // Brand color Indigo
        doc.text(`Slide ${index + 1}`, margin, margin + 5);

        // Content text lines
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        let y = margin + 18;
        const lineSpacing = 6;
        const maxTextWidth = pageWidth - (margin * 2);

        slideLines.forEach(line => {
          // Wrap line to fit slide page
          const splitLines = doc.splitTextToSize(line, maxTextWidth);
          splitLines.forEach((splitLine: string) => {
            if (y < pageHeight - margin - 10) {
              doc.text(splitLine, margin, y);
              y += lineSpacing;
            }
          });
          y += 2; // Extra space between paragraphs
        });
      });

      const pdfBlob = doc.output('blob');

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success("PowerPoint slides converted to PDF successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to convert PPTX. Please upload a valid .pptx file.");
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
          <span><strong>100% Client-Side Extraction:</strong> Compile PowerPoint presentation slide structures into standard print PDF sheets offline.</span>
        </div>
        <FileUploader 
          accept=".pptx" 
          onFileSelect={handleFileSelect} 
          title="Upload PowerPoint File (.pptx)"
          subtitle="Converts slide texts to landscaped PDF layouts"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <Presentation className="w-8 h-8 text-indigo-500" />
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
              <FileText className="w-5 h-5 text-indigo-500" />
              Convert PPTX to PDF Slides
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will unzip the presentation, extract slide titles/body texts from slide XML structures, and render them as printable landscape PDF sheets.
            </p>
          </div>

          <button 
            onClick={convertPptToPdf}
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
                <Presentation className="w-4 h-4" />
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
                  <p className="font-bold text-center">{file.name.replace('.pptx', '')}.pdf</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Converted successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.pptx', '')}.pdf`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download PDF File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <Presentation className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted PDF file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
