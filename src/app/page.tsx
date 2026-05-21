"use client";

import React, { useState, useMemo } from 'react';
import { toolsRegistry } from '@/registry/tools';
import Link from 'next/link';

// Localized synonym dictionary for fuzzy searching
const SYNONYM_DICT: Record<string, string[]> = {
  "compress": ["reduce", "shrink", "smaller", "kb size"],
  "crop": ["trim", "cut", "resize"],
  "pdf": ["document", "doc"],
  "image": ["photo", "pic", "picture", "jpg", "png"],
  "aadhaar": ["aadhar", "uidai", "id card"],
  "pan": ["pancard", "nsdl", "tax id"],
  "passport": ["visa photo", "travel photo"],
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Group tools dynamically by all categories
  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(toolsRegistry.map(t => t.category)));
    
    const grouped = allCategories.map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      title: cat === 'indian-utilities' ? 'Indian Government Utilities' : `${cat} Utilities`,
      tools: toolsRegistry.filter(t => t.category === cat),
      highlight: ['indian-utilities', 'Image', 'PDF', 'Developer'].includes(cat),
    }));

    // Sort to put highlighted categories at the top
    grouped.sort((a, b) => {
      if (a.highlight && !b.highlight) return -1;
      if (!a.highlight && b.highlight) return 1;
      // Indian utilities pinned to the absolute top
      if (a.id === 'indian-utilities') return -1;
      if (b.id === 'indian-utilities') return 1;
      return a.title.localeCompare(b.title);
    });
    
    return grouped;
  }, []);

  // Fuzzy Search Implementation
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    
    // Expand query with synonyms
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
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30 font-sans antialiased">
      {/* Hero Search Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-6 drop-shadow-sm">
          The Ultralux Engine
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-12">
          100% Client-Side. Zero Data Retention. Search 200+ edge-optimized utilities instantly.
        </p>

        {/* High-Performance Search Bar */}
        <div className="w-full max-w-3xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:opacity-100 opacity-50" />
          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl transition-all focus-within:border-white/30 focus-within:bg-zinc-900/80">
            <svg className="w-6 h-6 text-zinc-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="What do you need to do? (e.g. 'reduce KB size', 'passport photo')"
              className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0 px-4 py-4 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 text-zinc-500 hover:text-zinc-300 mr-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid Layouts */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-zinc-500">No matching tools found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-400 hover:text-blue-300 underline underline-offset-4">Clear search</button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <div key={category.id} className="relative">
                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 mb-8 flex items-center gap-3">
                  {category.title}
                  {category.highlight && (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      High Demand
                    </span>
                  )}
                </h2>

                {/* Tool Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.tools.map((tool) => (
                    <Link 
                      href={`/${tool.category.toLowerCase().replace(/\s+/g, '-')}/${tool.slug}`} 
                      key={tool.id}
                      className="group block"
                    >
                      <div className={`h-full rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md relative overflow-hidden
                        ${category.highlight 
                          ? 'bg-gradient-to-b from-blue-900/10 to-transparent border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]' 
                          : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-900/60 hover:border-white/20'
                        }`}
                      >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <h3 className="text-lg font-semibold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}