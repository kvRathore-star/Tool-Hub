"use client";

import React, { useState, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { downloadOrShare } from '@/utils/nativeShare';
import { toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { ShieldAlert, Lock, Download, FileText, RefreshCw } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    setPassword('');
    setConfirmPassword('');
    setProgress(0);
  };

  const handleProtect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (!password) {
      return toast.error("Please enter a password.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Initializing PDF parser...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;

      // Initialize jsPDF with encryption settings
      // jsPDF supports encryption options: userPassword, ownerPassword, userPermissions
      const doc = new jsPDF({
        encryption: {
          userPassword: password,
          ownerPassword: password,
          userPermissions: ['print', 'copy']
        }
      });

      for (let i = 1; i <= totalPages; i++) {
        setStatusText(`Securing page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Good balance of quality and size

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        // Convert page viewport dimension to jsPDF mm dimensions
        const widthMm = viewport.width * 0.264583;
        const heightMm = viewport.height * 0.264583;

        if (i > 1) {
          doc.addPage([widthMm, heightMm]);
        } else {
          // Adjust first page size to match original PDF aspect ratio
          doc.deletePage(1);
          doc.addPage([widthMm, heightMm]);
        }

        doc.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm);
        setProgress(Math.round((i / totalPages) * 100));
      }

      setStatusText("Saving encrypted file...");
      const pdfBlob = doc.output('blob');

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(pdfBlob));
      toast.success("PDF password-protected successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to protect PDF. Try a smaller file.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const clearAll = () => {
    setFile(null);
    setOutputUrl(null);
    setPassword('');
    setConfirmPassword('');
    setProgress(0);
  };

  if (!file) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span><strong>Secure Client-Side Encryption:</strong> Your files never leave your computer. We encrypt your document directly in your browser.</span>
        </div>
        <FileUploader 
          accept="application/pdf"
          onFileSelect={handleFileSelect} 
          title="Upload PDF to Protect"
          subtitle="Add password encryption to your PDF"
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
          className="text-xs text-zinc-650 dark:text-zinc-300 px-3 py-2 bg-zinc-150 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Change File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <form onSubmit={handleProtect} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-zinc-900 dark:text-white font-bold text-base flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              Set Encryption Password
            </h4>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (minimum 4 characters)..."
                minLength={4}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-205 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-350"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password..."
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-205 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-350"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{statusText} ({progress}%)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Encrypt & Protect PDF</span>
              </>
            )}
          </button>
        </form>

        {/* Output Panel */}
        <div className="flex flex-col justify-center">
          {outputUrl ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-2xl shadow-xl space-y-6 animate-in zoom-in-95 duration-300 h-full flex flex-col justify-center">
               <div className="bg-indigo-500/10 rounded-xl overflow-hidden border border-indigo-500/20 flex flex-col items-center justify-center p-8 text-indigo-500">
                  <Lock className="w-16 h-16 mb-4" />
                  <p className="font-bold text-center">protected_{file.name}</p>
                  <p className="text-xs text-indigo-500/80 mt-1">Ready for download with password protection.</p>
               </div>

               <button 
                  onClick={() => downloadOrShare(outputUrl, `protected_${file.name}`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Protected PDF
                </button>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-205 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px] text-zinc-400 text-center">
               <Lock className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium">Protected PDF will appear here</p>
               <p className="text-xs text-zinc-500 max-w-xs mt-1">Set a password and click the button to encrypt your PDF.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
