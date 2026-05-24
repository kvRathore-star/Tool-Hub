"use client";

import React, { useState, useMemo } from 'react';
import { toolsRegistry } from '@/registry/tools';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Sparkles, Zap, Shield, Cpu, Clock, ChevronRight } from 'lucide-react';

const SYNONYM_DICT: Record<string, string[]> = {
  "compress": ["reduce", "shrink", "smaller", "kb size"],
  "crop": ["trim", "cut", "resize"],
  "pdf": ["document", "doc"],
  "image": ["photo", "pic", "picture", "jpg", "png"],
  "aadhaar": ["aadhar", "uidai", "id card"],
  "pan": ["pancard", "nsdl", "tax id"],
  "passport": ["visa photo", "travel photo"],
};

const FEATURES = [
  { icon: Shield, title: "100% Private", desc: "Files never leave your device" },
  { icon: Zap, title: "Lightning Fast", desc: "Instant local processing" },
  { icon: Cpu, title: "Edge Powered", desc: "Runs directly in browser" },
  { icon: Clock, title: "Zero Wait", desc: "No queues or upload times" }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(toolsRegistry.map(t => t.category).filter(Boolean)));
    
    const grouped = allCategories.map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      title: cat === 'indian-utilities' ? 'Indian Gov Utilities' : `${cat} Utilities`,
      tools: toolsRegistry.filter(t => t.category === cat),
      highlight: ['indian-utilities', 'AI', 'PDF', 'Image'].includes(cat),
    }));

    grouped.sort((a, b) => {
      if (a.highlight && !b.highlight) return -1;
      if (!a.highlight && b.highlight) return 1;
      if (a.id === 'indian-utilities') return -1;
      if (b.id === 'indian-utilities') return 1;
      return a.title.localeCompare(b.title);
    });
    
    return grouped;
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    const searchTerms = [query];
    
    Object.entries(SYNONYM_DICT).forEach(([key, synonyms]) => {
      if (key.includes(query) || synonyms.some(s => s.includes(query) || query.includes(s))) {
        searchTerms.push(key, ...synonyms);
      }
    });

    return categories.map(cat => ({
      ...cat,
      tools: cat.tools.filter(tool => {
        const searchableText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      })
    })).filter(cat => cat.tools.length > 0);

  }, [searchQuery, categories]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 dark:bg-violet-900/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Introducing ToolHub V2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl sm:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 mb-8"
        >
          The Ultimate <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">Workspace</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mb-12"
        >
          200+ offline-first utilities. Everything processed locally in your browser. Zero tracking. Zero wait times.
        </motion.p>
 
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl relative group z-10"
        >
          <div className="absolute inset-[-2px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl blur-lg transition-all duration-500 opacity-20 group-hover:opacity-40" />
          <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center p-2 shadow-2xl transition-all focus-within:ring-2 ring-blue-500/50">
            <Search className="w-6 h-6 text-zinc-400 ml-4" />
            <input
              type="text"
              placeholder="What do you need to do? (e.g., compress pdf, resize image)"
              className="w-full bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none px-4 py-5 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mr-2"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 text-left"
        >
          {FEATURES.map((feat, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 inline-flex">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{feat.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
 
      {/* Grid Layouts */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32 relative z-10">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-2xl text-zinc-500">No tools found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-500 hover:text-blue-600 font-medium">Clear search</button>
          </div>
        ) : (
          <div className="space-y-24">
            {filteredCategories.map((category, idx) => (
              <motion.div 
                key={category.id} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Section Title */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                    {category.title}
                    {category.highlight && (
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                        Popular
                      </span>
                    )}
                  </h2>
                  <Link href={`/${category.id}`} className="hidden sm:flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
 
                {/* Tool Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool) => (
                    <Link 
                      href={`/${tool.category.toLowerCase().replace(/\s+/g, '-')}/${tool.slug}`} 
                      key={tool.id}
                      className="group block h-full"
                    >
                      <div className="relative h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 overflow-hidden">
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-violet-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-xl">🚀</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                          
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}