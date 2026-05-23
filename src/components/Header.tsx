"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Search, 
  Sparkles, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  DollarSign, 
  Hammer, 
  ChevronDown, 
  Layers,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { CommandMenu } from "./CommandMenu";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"popular" | "ai" | "categories">("popular");

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mega menu on window click or scroll
  useEffect(() => {
    const handleScroll = () => setMegaMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const popularTools = [
    { name: "MP3 Compressor", href: "/utility/mp3-compressor", desc: "Reduce MP3 size with bitrate control" },
    { name: "PDF Compressor", href: "/pdf/pdf-compressor", desc: "Shrink PDF files without quality loss" },
    { name: "Video Trimmer", href: "/video/video-trimmer", desc: "Trim and cut videos locally" },
    { name: "eSign PDF", href: "/pdf/esign-pdf", desc: "Add digital signatures to PDFs" },
    { name: "AI Image Upscaler", href: "/ai/ai-image-upscaler", desc: "Upscale images up to 8x resolution" },
    { name: "PDF Form Filler", href: "/pdf/pdf-form-filler", desc: "Fill and sign PDF forms online" },
  ];

  const aiTools = [
    { name: "Multi-Model AI Chat", href: "/ai/multi-model-ai-chat", desc: "Claude + GPT-4o + Gemini in one" },
    { name: "AI Document Chat", href: "/ai/ai-document-chat", desc: "Upload and ask questions from PDFs" },
    { name: "AI Image Generator", href: "/image/ai-image-generator", desc: "Create art using text prompts" },
    { name: "AI Paraphrasing Tool", href: "/text/ai-paraphrasing-tool", desc: "Rewrite text with professional tones" },
  ];

  const categoriesList = [
    { name: "Indian Utilities", href: "/indian-utilities", icon: Zap, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "AI & Generation", href: "/ai", icon: Sparkles, color: "text-violet-500 bg-violet-500/10" },
    { name: "PDF Editing", href: "/pdf", icon: FileText, color: "text-red-500 bg-red-500/10" },
    { name: "Image Tools", href: "/image", icon: ImageIcon, color: "text-blue-500 bg-blue-500/10" },
    { name: "Video Tools", href: "/video", icon: Video, color: "text-pink-500 bg-pink-500/10" },
    { name: "Finance Calculators", href: "/finance", icon: DollarSign, color: "text-yellow-500 bg-yellow-500/10" },
    { name: "Converters", href: "/converter", icon: Layers, color: "text-cyan-500 bg-cyan-500/10" },
    { name: "Utilities", href: "/utility", icon: Hammer, color: "text-zinc-500 bg-zinc-500/10" },
  ];

  return (
    <header className="sticky top-0 z-[90] w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              TH
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              ToolHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  megaMenuOpen 
                    ? "text-blue-600 dark:text-blue-400 bg-zinc-100/50 dark:bg-zinc-900/50" 
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
                }`}
              >
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-1 w-[720px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-3 gap-6 z-[95] backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95"
                  >
                    {/* Column 1: Popular Tools */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                        <span>Most Popular</span>
                      </div>
                      <div className="space-y-1">
                        {popularTools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="block p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                              {tool.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: AI Hub */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        <span>AI Features</span>
                      </div>
                      <div className="space-y-1">
                        {aiTools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="block p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {tool.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                              {tool.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link 
                        href="/ai" 
                        className="flex items-center gap-1.5 text-xs text-violet-500 font-semibold hover:underline pl-2 group"
                        onClick={() => setMegaMenuOpen(false)}
                      >
                        <span>Explore AI Hub</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* Column 3: Categories Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Categories</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {categoriesList.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 ${cat.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                                {cat.name}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/indian-utilities" 
              className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              India Govt Tools
            </Link>
            
            <Link 
              href="/ai" 
              className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              AI Tools
            </Link>
          </nav>
        </div>

        {/* Right Section: Cmd+K Search, Theme Toggle, CTA */}
        <div className="flex items-center gap-3">
          {/* Cmd+K Command Palette Trigger Button */}
          <CommandMenu />

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 transition-all cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-zinc-400 group-hover:text-zinc-200" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-zinc-600" />
              )}
            </button>
          )}

          {/* SaaS Pro Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/25 select-none animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
            <span>100% Secure & Offline</span>
          </div>
        </div>
      </div>
    </header>
  );
}
