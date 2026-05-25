"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Search, Zap } from "lucide-react";
import { CommandMenu } from "./CommandMenu";
import { Button } from "./ui/button";

const MEGAMENU_COLUMNS = [
  {
    title: "🖼 Image",
    tools: [
      { name: "Compress", href: "/image/image-compressor" },
      { name: "Resize", href: "/image/image-resizer" },
      { name: "BG Remove", href: "/image/background-remover" },
      { name: "Upscale", href: "/image/ai-image-upscaler" },
      { name: "HEIC→JPG", href: "/image/heic-to-jpg" },
    ],
    allCount: 21,
    allHref: "/tools/image"
  },
  {
    title: "📄 PDF",
    tools: [
      { name: "Compress", href: "/pdf/pdf-compressor" },
      { name: "Merge", href: "/pdf/pdf-merger" },
      { name: "Split", href: "/pdf/pdf-splitter" },
      { name: "to Word", href: "/pdf/pdf-to-word" },
      { name: "to Excel", href: "/pdf/pdf-to-excel" },
    ],
    allCount: 16,
    allHref: "/tools/pdf"
  },
  {
    title: "✍ Text",
    tools: [
      { name: "AI Write", href: "/text/ai-writing-assistant" },
      { name: "Grammar", href: "/extension/grammar-checker-extension" },
      { name: "Paraphrase", href: "/text/ai-paraphrasing-tool" },
      { name: "Summarize", href: "/text/text-summarizer" },
      { name: "Translate", href: "/text/ai-translator" },
    ],
    allCount: 15,
    allHref: "/tools/text"
  },
  {
    title: "🎵 Audio",
    tools: [
      { name: "Transcribe", href: "/transcription/video-to-text-transcription" },
      { name: "Convert", href: "/audio/mp3-converter" },
      { name: "Cut/Trim", href: "/audio/audio-cutter" },
      { name: "TTS", href: "/audio/text-to-speech-tts" },
      { name: "Noise Rmv", href: "/audio/audio-noise-reduction" },
    ],
    allCount: 8,
    allHref: "/tools/audio"
  },
  {
    title: "🤖 AI Tools",
    tools: [
      { name: "AI Chat Hub", href: "/ai/ai-chat-hub" },
      { name: "Image Gen", href: "/image/ai-image-generator" },
      { name: "PDF Chat", href: "/ai/ai-document-chat" },
      { name: "Code Gen", href: "/ai/ai-code-generator" },
      { name: "Video Summarize", href: "/video/ai-video-summarizer" },
    ],
    allCount: 12,
    allHref: "/tools/ai"
  },
  {
    title: "📹 Video",
    tools: [
      { name: "Compress", href: "/video/video-compressor" },
      { name: "to GIF", href: "/video/video-to-gif" },
      { name: "Trim", href: "/video/video-trimmer" },
      { name: "Subtitle", href: "/video/subtitle-generator" },
    ],
    allCount: 11,
    allHref: "/tools/video"
  },
  {
    title: "🔄 Convert",
    tools: [
      { name: "MP4→MP3", href: "/converter/mp4-to-mp3" },
      { name: "YT DL", href: "/downloader/youtube-downloader" },
      { name: "TikTok", href: "/downloader/tiktok-video-downloader" },
      { name: "SoundCloud", href: "/downloader/soundcloud-downloader" },
    ],
    allCount: 22,
    allHref: "/tools/convert"
  }
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!megaMenuOpen) return;
      if (e.key === "Escape") {
        setMegaMenuOpen(false);
      }
      // Extremely basic arrow navigation capture to prevent scroll
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        // A full roving tabindex system would be ideal here for production
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [megaMenuOpen]);

  return (
    <header className={`sticky top-0 z-[1000] w-full h-[60px] border-b border-[var(--border-subtle)] transition-all duration-300 ${isScrolled ? 'bg-[var(--bg-elevated)]/80 backdrop-blur-md' : 'bg-[var(--bg-elevated)]'}`}>
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
              ref={triggerRef}
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
              onFocus={() => setMegaMenuOpen(true)}
              onBlur={(e) => {
                if (!triggerRef.current?.contains(e.relatedTarget)) {
                  setMegaMenuOpen(false);
                }
              }}
            >
              <button 
                className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                  megaMenuOpen 
                    ? "text-[var(--text-primary)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
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
                    ref={menuRef}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
                    className="absolute left-0 top-[100%] mt-4 w-[1000px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-b-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden z-[1000]"
                  >
                    {/* Inline Search Bar */}
                    <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="w-4 h-4 text-[var(--text-muted)]" />
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Search tools..." 
                          className="bg-transparent border-none outline-none text-[var(--text-primary)] text-sm w-full placeholder:text-[var(--text-muted)]"
                        />
                      </div>
                      <div className="text-[10px] font-mono bg-[var(--bg-surface)] px-2 py-1 rounded text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        ⌘K to search
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-5 gap-6">
                      {/* Top Row: 5 columns */}
                      {MEGAMENU_COLUMNS.slice(0, 5).map((col, idx) => (
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
                                  className="block py-1.5 pl-2 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-l-2 hover:border-[var(--accent)] transition-all border-l-2 border-transparent focus:outline-none focus:text-[var(--text-primary)] focus:border-[var(--accent)]"
                                  onClick={() => setMegaMenuOpen(false)}
                                >
                                  {t.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link 
                            href={col.allHref}
                            className="mt-3 pl-2 text-[12px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            → All {col.allCount}
                          </Link>
                        </motion.div>
                      ))}

                      {/* Bottom Row inside Grid: Video, Convert, India */}
                      {MEGAMENU_COLUMNS.slice(5, 7).map((col, idx) => (
                        <motion.div 
                          key={col.title}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (idx + 5) * 0.03 }}
                          className="flex flex-col border-t border-[var(--border-subtle)] pt-6 mt-2"
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
                            className="mt-3 pl-2 text-[12px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            → All {col.allCount}
                          </Link>
                        </motion.div>
                      ))}

                      {/* India Section Spans 3 columns */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 7 * 0.03 }}
                        className="col-span-3 border-t border-[var(--border-subtle)] pt-6 mt-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,107,53,0.05)] to-transparent border border-[var(--border-subtle)] p-4"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--india)]" />
                        <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span> India Utilities
                        </h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          <Link href="/tools/india/passport" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block" onClick={() => setMegaMenuOpen(false)}>Passport Photo Maker</Link>
                          <Link href="/tools/india/aadhaar" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block" onClick={() => setMegaMenuOpen(false)}>Aadhaar Crop & Mask</Link>
                          <Link href="/tools/india/pan" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block" onClick={() => setMegaMenuOpen(false)}>PAN Card Resizer</Link>
                          <Link href="/tools/india/gst" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block" onClick={() => setMegaMenuOpen(false)}>GST Invoice Gen</Link>
                        </div>
                      </motion.div>
                    </div>

                    {/* Most Used Ticker */}
                    <div className="bg-[var(--bg-overlay)] border-t border-[var(--border-subtle)] px-6 py-2.5 flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-red-500 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Most used today:</span>
                      <div className="flex gap-4 text-[12px] font-medium text-[var(--text-secondary)]">
                        <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">BG Remover</span>
                        <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">PDF Compress</span>
                        <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">YT Download</span>
                      </div>
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

          <div className="hidden sm:flex items-center gap-3">
            {/* Free Uses Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-overlay)] cursor-help" title="Resets at midnight">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[12px] font-mono text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">5</strong> free uses</span>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="hover:scale-105 active:scale-95 transition-transform">Sign in</Link>
            </Button>
            
            {/* CTA Glow Button */}
            <Button 
              variant="primary" 
              size="sm" 
              className="group relative hover:scale-105 active:scale-95 transition-all shadow-[var(--shadow-glow-accent)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] border-none" 
              asChild
            >
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
