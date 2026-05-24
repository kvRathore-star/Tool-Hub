"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { CommandMenu } from "./CommandMenu";
import { Button } from "./ui/button";

// Dummy data based on the Master Prompt requirements
const MEGAMENU_COLUMNS = [
  {
    title: "Image",
    tools: [
      { name: "Compress", href: "/image/compress" },
      { name: "Resize", href: "/image/resize" },
      { name: "BG Remove", href: "/image/background-remover" },
      { name: "Upscale", href: "/image/upscale" },
      { name: "HEIC→JPG", href: "/image/heic-to-jpg" },
    ],
    allCount: 21,
    allHref: "/tools/image"
  },
  {
    title: "PDF",
    tools: [
      { name: "Compress", href: "/pdf/compress" },
      { name: "Merge", href: "/pdf/merge" },
      { name: "Split", href: "/pdf/split" },
      { name: "to Word", href: "/pdf/to-word" },
      { name: "to Excel", href: "/pdf/to-excel" },
    ],
    allCount: 16,
    allHref: "/tools/pdf"
  },
  {
    title: "Text",
    tools: [
      { name: "AI Write", href: "/text/ai-write" },
      { name: "Grammar", href: "/text/grammar" },
      { name: "Paraphrase", href: "/text/paraphrase" },
      { name: "Summarize", href: "/text/summarize" },
      { name: "Translate", href: "/text/translate" },
    ],
    allCount: 15,
    allHref: "/tools/text"
  },
  {
    title: "Audio",
    tools: [
      { name: "Transcribe", href: "/audio/transcribe" },
      { name: "Convert", href: "/audio/convert" },
      { name: "Cut/Trim", href: "/audio/trim" },
      { name: "TTS", href: "/audio/tts" },
      { name: "Noise Rmv", href: "/audio/noise-remove" },
    ],
    allCount: 8,
    allHref: "/tools/audio"
  },
  {
    title: "AI Tools",
    tools: [
      { name: "AI Chat Hub", href: "/ai-hub" },
      { name: "Image Gen", href: "/ai/image-gen" },
      { name: "PDF Chat", href: "/ai/pdf-chat" },
      { name: "Code Gen", href: "/ai/code-gen" },
      { name: "Doc Summarize", href: "/ai/doc-summarize" },
    ],
    allCount: 12,
    allHref: "/tools/ai"
  }
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-[1000] w-full h-[60px] bg-[var(--bg-elevated)]/85 backdrop-blur-[12px] border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="mx-auto flex max-w-[1280px] h-full items-center justify-between px-4 sm:px-6">
        
        {/* Left Section: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1 group select-none">
            <span className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
              Tool<span className="text-[var(--accent)]">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                  megaMenuOpen 
                    ? "text-[var(--text-primary)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
                {megaMenuOpen && (
                  <div className="absolute bottom-[-16px] left-0 w-full h-[16px] bg-transparent" />
                )}
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
                    className="absolute left-0 top-[100%] mt-4 w-[1000px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-b-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden z-[1000]"
                  >
                    <div className="p-6 grid grid-cols-5 gap-6">
                      {MEGAMENU_COLUMNS.map((col, idx) => (
                        <motion.div 
                          key={col.title}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="flex flex-col"
                        >
                          <h4 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
                            {col.title}
                            <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
                          </h4>
                          <ul className="space-y-1 flex-1">
                            {col.tools.map((t) => (
                              <li key={t.name}>
                                <Link
                                  href={t.href}
                                  className="block py-1.5 pl-2 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-l-2 hover:border-[var(--accent)] transition-all border-l-2 border-transparent"
                                  onClick={() => setMegaMenuOpen(false)}
                                >
                                  {t.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link 
                            href={col.allHref}
                            className="mt-4 pl-2 text-[12px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            → All {col.allCount} tools
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* India Section Footer inside Mega Menu */}
                    <div className="w-full bg-gradient-to-r from-[rgba(255,107,53,0.08)] to-transparent border-t border-[var(--border-subtle)] p-4 px-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="text-[13px] font-medium text-[var(--text-primary)] flex items-center gap-2">
                          <span className="text-[16px]">🇮🇳</span> India Utilities
                        </span>
                        <div className="flex gap-4 text-[13px] text-[var(--text-secondary)]">
                          <Link href="/tools/india/passport" className="hover:text-[var(--text-primary)] transition-colors">Passport Photo</Link>
                          <Link href="/tools/india/aadhaar" className="hover:text-[var(--text-primary)] transition-colors">Aadhaar Crop</Link>
                          <Link href="/tools/india/pan" className="hover:text-[var(--text-primary)] transition-colors">PAN Resize</Link>
                          <Link href="/tools/india/gst" className="hover:text-[var(--text-primary)] transition-colors">GST Invoice</Link>
                        </div>
                      </div>
                      <Link href="/tools/india" className="text-[12px] text-[var(--india)] font-medium hover:underline">View all →</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/ai-hub" className="px-3 py-2 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              AI Hub
            </Link>
            <Link href="/extension" className="px-3 py-2 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Extension
            </Link>
            <Link href="/pricing" className="px-3 py-2 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Pricing
            </Link>
            <Link href="/api" className="px-3 py-2 text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              API
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <CommandMenu />

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="primary" size="sm" className="group" asChild>
              <Link href="/pricing">
                Get Pro <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-[3px] transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </header>
  );
}
