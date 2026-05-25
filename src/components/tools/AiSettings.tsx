"use client";

import React, { useState } from 'react';
import { useAiProvider, AiProvider } from '@/hooks/useAiProvider';

export default function AiSettings() {
  const { provider, apiKey, isConfigured, saveConfiguration, clearConfiguration } = useAiProvider();
  
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(provider);
  const [inputKey, setInputKey] = useState(apiKey);
  const [isOpen, setIsOpen] = useState(!isConfigured);

  const handleSave = () => {
    saveConfiguration(selectedProvider, inputKey);
    setIsOpen(false);
  };

  if (!isOpen && isConfigured) {
    return (
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          AI Provider Configured ({provider})
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
           <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             Configure AI Provider
           </h3>
           <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
             To keep this tool 100% free and serverless, please provide your own API key. 
             Keys are stored securely in your browser's LocalStorage and never sent to our servers.
           </p>
        </div>
        {isConfigured && (
          <button onClick={() => setIsOpen(false)} className="text-blue-400 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">Select LLM Provider</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'gemini', name: 'Google Gemini', desc: 'Free Tier Available' },
              { id: 'groq', name: 'Groq (Llama 3)', desc: 'Extremely Fast & Free' },
              { id: 'openai', name: 'OpenAI (GPT-3.5)', desc: 'Requires Paid Account' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id as AiProvider)}
                className={`p-3 rounded-xl border text-left transition-all ${selectedProvider === p.id ? 'border-blue-500 bg-blue-500/10 shadow-sm' : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 opacity-70 hover:opacity-100'}`}
              >
                <div className="font-bold text-zinc-900 dark:text-white text-sm">{p.name}</div>
                <div className="text-xs text-zinc-500">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">API Key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder={`Enter your ${selectedProvider} API Key (sk-...)`}
              className="flex-1 bg-white dark:bg-zinc-800 border-2 border-blue-500/20 focus:border-blue-500 rounded-xl px-4 py-2 outline-none text-zinc-900 dark:text-white"
            />
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-colors shadow-lg"
            >
              Save Key
            </button>
          </div>
          <div className="mt-2 text-xs text-blue-600/70 dark:text-blue-400/70">
            {selectedProvider === 'gemini' && <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-500">Get a free Gemini API Key here →</a>}
            {selectedProvider === 'groq' && <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline hover:text-blue-500">Get a free Groq API Key here →</a>}
            {selectedProvider === 'openai' && <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline hover:text-blue-500">Get an OpenAI API Key here →</a>}
          </div>
        </div>
        
        {isConfigured && (
          <div className="pt-2 border-t border-blue-500/20 flex justify-end">
             <button onClick={clearConfiguration} className="text-xs text-red-500 hover:text-red-600 font-medium">Remove Key & Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
