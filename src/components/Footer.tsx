"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, HardDrive } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
                TH
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                ToolHub
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              The internet's largest library of offline-first, client-side web tools. Everything runs locally in your browser. We never track you, and your data never leaves your device.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Private & Encrypted</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>GPU/WASM Accelerated</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Zero Cloud Storage</span>
              </span>
            </div>
          </div>

          {/* Column 2: Popular Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Popular Utilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf/pdf-compressor" className="text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="/image/image-compressor" className="text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/video/video-trimmer" className="text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                  Video Trimmer
                </Link>
              </li>
              <li>
                <Link href="/utility/mp3-compressor" className="text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                  MP3 Compressor
                </Link>
              </li>
              <li>
                <Link href="/pdf/esign-pdf" className="text-zinc-600 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                  eSign PDF Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: AI & Text */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              AI Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ai/multi-model-ai-chat" className="text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                  Multi-Model AI Chat
                </Link>
              </li>
              <li>
                <Link href="/ai/ai-document-chat" className="text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                  AI Document Chat
                </Link>
              </li>
              <li>
                <Link href="/image/ai-image-generator" className="text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                  AI Image Generator
                </Link>
              </li>
              <li>
                <Link href="/ai/ai-code-generator" className="text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                  AI Code Writer
                </Link>
              </li>
              <li>
                <Link href="/extension/browser-extension" className="text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                  All-in-one AI Sidebar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Gov & India */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              India Utilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/indian-utilities/passport-photo-india" className="text-zinc-600 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  Passport Photo Cropper
                </Link>
              </li>
              <li>
                <Link href="/indian-utilities/aadhaar-wallet-cropper" className="text-zinc-600 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  Aadhaar Card Masker
                </Link>
              </li>
              <li>
                <Link href="/indian-utilities/pan-card-resizer" className="text-zinc-600 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  PAN Card Cropper
                </Link>
              </li>
              <li>
                <Link href="/indian-utilities/gst-invoice-generator" className="text-zinc-600 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  GST Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/indian-utilities/itr-filing-helper" className="text-zinc-600 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors">
                  ITR Filing Helper
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            &copy; {currentYear} ToolHub. All rights reserved. Made in India.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-100">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-100">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
