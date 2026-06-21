"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquare, Paperclip, Send, ChevronDown, Zap, Search, PenTool, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MODELS = [
  { id: 'claude', name: 'Claude 3.5', provider: 'Anthropic', cost: '10 credits' },
  { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI', cost: '10 credits' },
  { id: 'gemini', name: 'Gemini 1.5 Pro', provider: 'Google', cost: '8 credits' },
  { id: 'llama', name: 'Llama 3 70B', provider: 'CF Workers', cost: 'Free' },
];

export default function AIHubPage() {
  const [activeModel, setActiveModel] = useState(MODELS[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      
      {/* Hero Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Talk to any AI. Do anything.</h1>
            <p className="text-sm text-[var(--text-secondary)]">The ultimate unified command center.</p>
          </div>
        </div>

        {/* Model Switcher */}
        <div className="flex p-1 bg-[var(--bg-overlay)] rounded-lg border border-[var(--border-subtle)]">
          {MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setActiveModel(model)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeModel.id === model.id 
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)]'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar History */}
        <aside className="hidden lg:flex w-[260px] flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-base)]">
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <Button className="w-full justify-start gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-0">
              <Plus className="w-4 h-4" /> New chat
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-2">Today</div>
            <button className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] rounded-md transition-colors truncate">
              Extract tabular data from invoice
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] rounded-md transition-colors truncate">
              Python script for API polling
            </button>
            
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-6 px-2">Previous 7 Days</div>
            <button className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] rounded-md transition-colors truncate">
              Translate JSON localization file
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative bg-[var(--bg-base)]">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* System Greeting */}
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto pb-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-purple-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)]">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-serif mb-2">How can I help you today?</h2>
              <p className="text-[var(--text-secondary)] mb-8 text-sm">
                Type <kbd className="font-mono bg-[var(--bg-overlay)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">@</kbd> to attach tools. Type <kbd className="font-mono bg-[var(--bg-overlay)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">/</kbd> for quick actions.
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <button className="p-4 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-overlay)] hover:bg-[var(--bg-elevated)] transition-colors group">
                  <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
                    <Search className="w-4 h-4" /> <span className="font-medium text-sm">Search the web</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Find the latest news on tech.</p>
                </button>
                <button className="p-4 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-overlay)] hover:bg-[var(--bg-elevated)] transition-colors group">
                  <div className="flex items-center gap-2 text-[var(--warning)] mb-1">
                    <PenTool className="w-4 h-4" /> <span className="font-medium text-sm">Draft an email</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Ask for a timeline extension.</p>
                </button>
              </div>
            </div>
            
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)] to-transparent">
            <div className="max-w-3xl mx-auto">
              
              {/* Context Action Hints */}
              <div className="flex gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors">
                  <span className="text-[var(--accent)] font-mono">@pdf</span> Chat with PDF
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors">
                  <span className="text-emerald-400 font-mono">@image</span> Analyze Image
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)] transition-colors">
                  <span className="text-amber-400 font-mono">/summarize</span>
                </span>
              </div>

              {/* Chat Box */}
              <div className="relative bg-[var(--bg-overlay)] border border-[var(--border-subtle)] focus-within:border-[var(--accent)]/50 focus-within:ring-1 focus-within:ring-[var(--accent)]/20 rounded-2xl overflow-hidden transition-all shadow-lg">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${activeModel.name}...`}
                  className="w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] p-4 min-h-[60px] max-h-[200px] resize-none outline-none text-sm"
                  rows={2}
                />
                
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      {activeModel.cost}
                    </button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className={`rounded-xl h-10 w-10 p-0 ${message.trim() ? 'bg-[var(--accent)] text-white hover:opacity-90' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center mt-3">
                <p className="text-[11px] text-[var(--text-muted)]">
                  AI can make mistakes. Consider verifying critical information.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
