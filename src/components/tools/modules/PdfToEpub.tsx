"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Download, FileText, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToEpub() {
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

  const convertPdfToEpub = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Reading PDF pages...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const zip = new JSZip();

      // EPUB requires uncompressed mimetype as the first entry in the zip
      // JSZip level 0 compression represents STORE
      zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

      // Build container.xml
      zip.file("META-INF/container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      let manifestItems = "";
      let spineItems = "";
      let tocItems = "";

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Extracting text from page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by vertical position Y coordinate to maintain line structures
        const linesMap: { [y: number]: string[] } = {};
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!linesMap[y]) linesMap[y] = [];
          linesMap[y].push(item.str);
        });

        const sortedY = Object.keys(linesMap).map(Number).sort((a, b) => b - a);
        let paragraphsHtml = "";
        
        sortedY.forEach(y => {
          const lineStr = linesMap[y].join(' ').trim();
          if (lineStr) {
            // Escape special XML characters
            const escaped = lineStr
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");
            paragraphsHtml += `<p>${escaped}</p>\n`;
          }
        });

        // Write page chapter content
        const chapterFileName = `page_${i}.xhtml`;
        const chapterHtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Page ${i}</title>
    <style type="text/css">
      body { font-family: sans-serif; padding: 5%; line-height: 1.5; }
      p { margin: 0 0 1em 0; text-indent: 1.5em; }
      h1 { text-align: center; color: #4F46E5; }
    </style>
  </head>
  <body>
    <h1>Page ${i}</h1>
    ${paragraphsHtml}
  </body>
</html>`;

        zip.file(`OEBPS/${chapterFileName}`, chapterHtml);

        // Add to OPF manifest and spine elements
        manifestItems += `<item id="page_${i}" href="${chapterFileName}" media-type="application/xhtml+xml"/>\n`;
        spineItems += `<itemref idref="page_${i}"/>\n`;
        
        // Add to NCX Table of contents
        tocItems += `<navPoint id="navpoint-${i}" playOrder="${i}">
  <navLabel><text>Page ${i}</text></navLabel>
  <content src="${chapterFileName}"/>
</navPoint>\n`;

        setProgress(Math.round((i / totalPages) * 85));
      }

      setStatusText("Generating manifest and TOC tables...");
      
      const bookTitle = file.name.replace('.pdf', '');

      // content.opf package file
      const opfXml = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${bookTitle}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${Math.random().toString(36).substring(2, 15)}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;

      zip.file("OEBPS/content.opf", opfXml);

      // toc.ncx Table of Contents
      const ncxXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD NCX 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx-2005-1/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:book-id"/>
  </head>
  <docTitle><text>${bookTitle}</text></docTitle>
  <navMap>
    ${tocItems}
  </navMap>
</ncx>`;

      zip.file("OEBPS/toc.ncx", ncxXml);

      setStatusText("Compiling ebook package...");
      const epubBlob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(epubBlob));
      toast.success("PDF converted to EPUB successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to compile EPUB ebook.");
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
          <span><strong>100% Client-Side Compiler:</strong> Extract PDF text pages and compile them into structured EPUB Ebooks offline in your browser.</span>
        </div>
        <FileUploader 
          accept="application/pdf"
          onFileSelect={handleFileSelect} 
          title="Upload PDF to convert to EPUB"
          subtitle="Compiles pages as individual XHTML e-chapters"
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
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Convert to EPUB Ebook
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will extract text blocks from your PDF and pack them into standard EPUB directory structures, making it fully readable on Kindle, Apple Books, and e-readers.
            </p>
          </div>

          <button 
            onClick={convertPdfToEpub}
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
                <span>Convert to EPUB</span>
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
                  <p className="font-bold text-center">{file.name.replace('.pdf', '')}.epub</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Ebook compiled successfully.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `${file.name.replace('.pdf', '')}.epub`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download EPUB File
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <BookOpen className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Converted EPUB file will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
