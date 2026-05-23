"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AiChatHub() {
  const router = useRouter();

  const models = [
    { name: 'Claude 3.5 Sonnet', desc: 'Best for coding and deep reasoning.', slug: 'multi-model-ai-chat', color: 'from-orange-500 to-amber-500', logo: 'C' },
    { name: 'GPT-4o', desc: 'Fastest universal model for everyday tasks.', slug: 'multi-model-ai-chat', color: 'from-emerald-500 to-teal-500', logo: 'G' },
    { name: 'Gemini 1.5 Pro', desc: 'Massive context window for huge documents.', slug: 'multi-model-ai-chat', color: 'from-blue-500 to-indigo-500', logo: '✨' },
    { name: 'Document Chat (RAG)', desc: 'Upload PDFs and chat directly with them.', slug: 'ai-document-chat', color: 'from-rose-500 to-red-500', logo: '📄' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
          The Ultimate AI Hub
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Access all the world's most powerful AI models from a single interface. No need for multiple $20/mo subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map(model => (
          <div 
            key={model.name}
            onClick={() => router.push(`/ai/${model.slug}`)}
            className="group cursor-pointer relative bg-zinc-900 border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${model.color} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                {model.logo}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                <p className="text-zinc-400">{model.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
