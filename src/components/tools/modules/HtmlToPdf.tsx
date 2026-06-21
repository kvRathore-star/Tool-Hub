"use client";

import React, { useState, useEffect } from 'react';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { Download, FileText, RefreshCw, Sparkles, Code } from 'lucide-react';

export default function HtmlToPdf() {
  const [htmlInput, setHtmlInput] = useState(`<h1 style="color:#4f46e5;">Hello World</h1>
<p>This is a <strong>sample</strong> HTML document that will be converted to PDF.</p>
<ul>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</ul>`);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('document');

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const stripHtml = (html: string): string => {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const convertToPdf = async () => {
    if (!htmlInput.trim()) {
      toast.error('Please enter HTML content first.');
      return;
    }

    setIsProcessing(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const textWidth = pageWidth - margin * 2;
      const text = stripHtml(htmlInput);

      const lines = text.split('\n');
      let y = margin;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          y += 6;
          continue;
        }

        const wrappedLines = pdf.splitTextToSize(trimmed, textWidth);

        for (const wrapped of wrappedLines) {
          if (y + 7 > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            y = margin;
          }

          if (trimmed.startsWith('• ')) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(wrapped, margin + 5, y);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            pdf.text(wrapped, margin, y);
          }
          y += 7;
        }
      }

      const pdfBlob = pdf.output('blob');
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success('HTML converted to PDF successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to convert HTML to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setHtmlInput(content);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-indigo-400 text-sm flex items-center gap-2">
        <Sparkles className="w-5 h-5 flex-shrink-0" />
        <span><strong>100% Client-Side:</strong> Convert HTML markup to clean PDF documents entirely in your browser — no server uploads needed.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-zinc-900 dark:text-white font-bold text-base flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-500" />
              HTML Source
            </h4>
            <label className="text-xs text-indigo-500 font-bold cursor-pointer hover:underline">
              Upload .html file
              <input type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full h-80 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-[var(--text-secondary)] font-mono text-xs leading-relaxed outline-none focus:border-indigo-500 resize-none"
            placeholder="Enter HTML here..."
          />

          <button
            onClick={convertToPdf}
            disabled={isProcessing}
            className="w-full bg-[var(--accent)] hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
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
                <p className="font-bold text-center">{fileName}.pdf</p>
                <p className="text-xs text-emerald-500/80 mt-1">PDF document generated successfully.</p>
              </div>

              <button
                onClick={() => downloadOrShare(outputUrl, `${fileName}.pdf`)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-[var(--border-subtle)] dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
              <FileText className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">Generated PDF will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
