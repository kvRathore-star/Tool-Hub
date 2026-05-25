"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  User, 
  Sparkles,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const POSTS = [
  {
    id: "wasm-converters",
    title: "How WebAssembly is Replacing Server-Side Converters",
    excerpt: "Explore the compilation of LLVM utilities to WASM binaries that execute file compressions instantly in-browser.",
    author: "Arjun Mehta",
    date: "May 18, 2026",
    readTime: "6 min read",
    tag: "WebAssembly",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    slug: "/blog/wasm-converters"
  },
  {
    id: "offline-first-web",
    title: "The Future of Offline-First Web Applications",
    excerpt: "How Service Workers, LocalStorage, and local canvas architectures allow complete utility usage without network access.",
    author: "Rohan Sen",
    date: "April 29, 2026",
    readTime: "8 min read",
    tag: "Architecture",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    slug: "/blog/offline-first-web"
  },
  {
    id: "zero-telemetry-privacy",
    title: "Why Zero-Telemetry is Vital for Document Tools",
    excerpt: "Analyzing the security vulnerabilities of uploading sensitive legal PDFs to third-party server queues, and how to stay isolated.",
    author: "Sanjay Dixit",
    date: "March 15, 2026",
    readTime: "5 min read",
    tag: "Privacy",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    slug: "/blog/zero-telemetry-privacy"
  },
  {
    id: "webgl-image-tensors",
    title: "Optimizing Neural Networks on WebGL Canvas",
    excerpt: "How local execution of background-removal models runs directly on client GPUs using modern WebGL canvas engines.",
    author: "Mira Roy",
    date: "February 04, 2026",
    readTime: "7 min read",
    tag: "AI Engineering",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    slug: "/blog/webgl-image-tensors"
  }
];

export default function BlogGridPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      
      {/* Background Grids */}
      <div className="absolute inset-0 z-0 flex justify-center pointer-events-none opacity-[0.03]">
        <div className="w-full max-w-[1280px] h-full" style={{ backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent)] mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Engineering & Privacy Blog
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl mb-6 tracking-tight leading-tight">
            Read our latest news.
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)]">
            Technical guides, security analysis, and design studies on building local-first browser applications.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          
          {POSTS.map((post) => (
            <div 
              key={post.id} 
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 rounded-[var(--radius-2xl)] p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
            >
              
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{post.author}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{post.date}</div>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Full article simulator: "${post.title}" coming soon.`)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-white transition-colors group-hover:translate-x-0.5 transition-transform"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* Newsletter subscription box */}
        <div className="max-w-4xl mx-auto bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-[80px]" />
          <h3 className="text-2xl font-semibold mb-3">Subscribe to ToolHub Digest</h3>
          <p className="text-[var(--text-secondary)] text-sm max-w-lg mx-auto mb-6">
            Get technical insights about WebAssembly, client-side encryption, and product release logs.
          </p>
          
          {subscribed ? (
            <div className="max-w-md mx-auto py-3 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-lg text-[var(--accent)] font-semibold text-sm">
              ✓ Awesome! Check your inbox for confirmation soon.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@toolhub.com" 
                className="flex-1 bg-[var(--bg-base)] text-sm border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" 
              />
              <Button type="submit" className="shrink-0 gap-2">Subscribe <Sparkles className="w-4 h-4" /></Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
