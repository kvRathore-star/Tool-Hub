"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Command, ArrowRight, ShieldCheck, Zap, Server, ChevronRight, Play, Image as ImageIcon, FileText, Type, Mic, Video, Cpu, ArrowLeftRight } from 'lucide-react';
import { toolsRegistry } from '@/registry/tools';
import { Button } from '@/components/ui/button';

const STATS = [
  { label: "Operations processed", value: "10M+" },
  { label: "Files stored on server", value: "0" },
  { label: "Browser-based tools", value: "200+" },
];

const FEATURES = [
  { icon: ShieldCheck, title: "100% Private", desc: "Files never leave your device." },
  { icon: Zap, title: "Lightning Fast", desc: "Zero upload times. Instant processing." },
  { icon: Server, title: "Edge Powered", desc: "Runs instantly and securely on your device." },
];

export function HomeClient({ isIndia = false }: { isIndia?: boolean }) {
  const [activeTab, setActiveTab] = useState("compress");
  const [showIndia, setShowIndia] = useState(isIndia);

  React.useEffect(() => {
    if (isIndia) {
      setShowIndia(true);
    } else {
      const cookies = document.cookie.split(';');
      const countryCookie = cookies.find(c => c.trim().startsWith('user-country='));
      const country = countryCookie ? countryCookie.split('=')[1] : null;
      
      const isIndiaTZ = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Kolkata';
      if (country === 'IN' || isIndiaTZ) {
        setShowIndia(true);
      }
    }
  }, [isIndia]);

  // Sample tools for grid
  const popularTools = useMemo(() => {
    const featuredSlugs = ['pdf-compressor', 'image-compressor', 'ai-background-generator', 'qr-code-generator', 'gst-calculator', 'word-counter'];
    const tools = featuredSlugs.map(slug => toolsRegistry.find(t => t.slug === slug)).filter(Boolean) as typeof toolsRegistry;
    
    // Fallback to top 6 if some are missing
    if (tools.length < 6) {
      const remaining = 6 - tools.length;
      const additional = toolsRegistry.filter(t => !featuredSlugs.includes(t.slug)).slice(0, remaining);
      return [...tools, ...additional];
    }
    return tools;
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="flex flex-col items-start text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] mb-8"
            >
              <Command className="w-3.5 h-3.5" />
              <span>ToolHub V2.0 / Edge Compute</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-[family-name:var(--font-serif)] text-6xl sm:text-7xl lg:text-[84px] leading-[0.95] tracking-tight mb-8"
            >
              Do more.<br />
              <span className="text-[var(--text-muted)]">Wait less.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed font-[family-name:var(--font-sans)]"
            >
              Compress PDFs, edit images, and run AI models directly in your browser. Uncompromising privacy meets instant execution.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/tools">
                  Explore 200+ Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto group" asChild>
                <button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                  Press <kbd className="mx-2 font-mono text-[11px] bg-[var(--bg-overlay)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] group-hover:bg-[var(--bg-elevated)] transition-colors">⌘K</kbd> to search
                </button>
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-16 pt-8 border-t border-[var(--border-subtle)] w-full"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-mono text-xl text-[var(--text-primary)] font-semibold">{stat.value}</span>
                  <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Live Widget Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="relative lg:h-[600px] w-full flex items-center justify-center z-10"
          >
            {/* Abstract UI Window */}
            <div className="w-full max-w-[500px] aspect-[4/5] bg-[var(--bg-elevated)] rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] shadow-[var(--shadow-lg)] overflow-hidden flex flex-col relative">
              {/* Window Header */}
              <div className="h-12 border-b border-[var(--border-subtle)] flex items-center px-4 gap-2 bg-[var(--bg-overlay)]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              
              {/* Mock App Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex gap-4 mb-8">
                  {['compress', 'resize', 'convert'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-sm font-medium capitalize pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 border-2 border-dashed border-[var(--border-subtle)] rounded-[var(--radius-xl)] bg-[var(--bg-overlay)] flex flex-col items-center justify-center gap-4 transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--accent-soft)] cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                    <Play className="w-6 h-6 text-[var(--text-secondary)] ml-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Drop image here</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center bg-[var(--bg-overlay)] p-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Output Size</span>
                    <span className="text-sm font-mono text-[var(--success)]">-74% smaller</span>
                  </div>
                  <Button size="sm">Export</Button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-overlay)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
            {FEATURES.map((feat, i) => (
              <div key={i} className="py-12 px-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 text-[var(--text-primary)]">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-medium text-[var(--text-primary)] mb-3">{feat.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditional India Utilities Section */}
      {showIndia && (
        <section className="relative pt-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
          {/* Saffron Top Gradient */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B35]/50 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-[#FF6B35]/[0.03] to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-4xl text-[var(--text-primary)] mb-3">
              Built for Bharat <span className="inline-block ml-2">🇮🇳</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              The only tools platform that speaks your government's language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'passport', title: 'Passport Photo Maker', desc: '35×45mm, white background, ICAO compliant', slug: 'passport-photo-india' },
              { id: 'aadhaar', title: 'Aadhaar Crop & Mask', desc: 'Securely crop and mask Aadhaar numbers locally', slug: 'aadhaar-wallet-cropper' },
              { id: 'pan', title: 'PAN Card Resizer', desc: '200×200px, under 200KB for NSDL/UTIITSL', slug: 'pan-card-resizer' },
              { id: 'gst', title: 'GST Invoice Generator', desc: 'Format perfectly per GST Act 2017 rules', slug: 'gst-invoice-generator' },
            ].map((item) => (
              <Link 
                key={item.id} 
                href={`/indian-utilities/${item.slug}`}
                className="group p-6 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/[0.02] transition-colors"
              >
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-2 group-hover:text-[#FF6B35] transition-colors">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-[family-name:var(--font-serif)] text-4xl text-[var(--text-primary)]">Popular Utilities</h2>
          <Link href="/tools" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center transition-colors">
            View directory <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => {
            const isImage = tool.category.includes('Image');
            const isPdf = tool.category.includes('PDF');
            const isText = tool.category.includes('Text');
            const isAudio = tool.category.includes('Audio');
            const isVideo = tool.category.includes('Video');
            const isAI = tool.category.includes('AI');
            const isIndia = tool.category.includes('India');
            
            let borderColor = 'border-l-transparent';
            let iconColor = 'text-[var(--text-muted)]';
            let bgTint = 'bg-[var(--bg-overlay)]';
            
            if (isImage) { borderColor = 'border-l-purple-500'; iconColor = 'text-purple-500'; bgTint = 'bg-purple-500/10'; }
            else if (isPdf) { borderColor = 'border-l-amber-500'; iconColor = 'text-amber-500'; bgTint = 'bg-amber-500/10'; }
            else if (isText) { borderColor = 'border-l-teal-500'; iconColor = 'text-teal-500'; bgTint = 'bg-teal-500/10'; }
            else if (isAudio) { borderColor = 'border-l-pink-500'; iconColor = 'text-pink-500'; bgTint = 'bg-pink-500/10'; }
            else if (isVideo) { borderColor = 'border-l-blue-500'; iconColor = 'text-blue-500'; bgTint = 'bg-blue-500/10'; }
            else if (isAI) { borderColor = 'border-l-indigo-500'; iconColor = 'text-indigo-500'; bgTint = 'bg-indigo-500/10'; }
            else if (isIndia) { borderColor = 'border-l-[#FF6B35]'; iconColor = 'text-[#FF6B35]'; bgTint = 'bg-[#FF6B35]/10'; }
            else { borderColor = 'border-l-orange-500'; iconColor = 'text-orange-500'; bgTint = 'bg-orange-500/10'; }

            return (
              <Link 
                key={tool.id} 
                href={`/${tool.category.toLowerCase().replace(/\s+/g, '-')}/${tool.slug}`}
                className="group block h-full"
              >
                <div className={`h-full p-5 bg-[var(--bg-elevated)] border-y border-r border-l-2 border-y-[var(--border-subtle)] border-r-[var(--border-subtle)] ${borderColor} rounded-[var(--radius-xl)] hover:border-y-[var(--border-default)] hover:border-r-[var(--border-default)] transition-all duration-200 shadow-sm hover:shadow-[var(--shadow-md)] hover:-translate-y-1`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-8 h-8 rounded-full ${bgTint} flex items-center justify-center`}>
                      {isImage ? <ImageIcon className={`w-4 h-4 ${iconColor}`} /> :
                       isPdf ? <FileText className={`w-4 h-4 ${iconColor}`} /> :
                       isText ? <Type className={`w-4 h-4 ${iconColor}`} /> :
                       isAudio ? <Mic className={`w-4 h-4 ${iconColor}`} /> :
                       isVideo ? <Video className={`w-4 h-4 ${iconColor}`} /> :
                       isAI ? <Cpu className={`w-4 h-4 ${iconColor}`} /> :
                       <ArrowLeftRight className={`w-4 h-4 ${iconColor}`} />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-overlay)] border border-[var(--border-subtle)] px-2 py-0.5 rounded">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors flex items-center gap-2">
                    {tool.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[var(--accent)]" />
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                    {tool.description}
                  </p>
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                    <div className={`h-full ${bgTint.replace('/10', '')} opacity-50`} style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}